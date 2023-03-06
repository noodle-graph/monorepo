import { readFile } from 'fs/promises';
import { join } from 'path';

import type { NoodlePlugin, Relationship, Resource, ScanOptions, ScanResult, Source } from '@noodle-graph/types';
import type { Logger } from 'pino';

import { FilesIteratorFactory } from './filesIteratorFactory';
import type { FilesIteratorSettings, ScanContext } from './types';
import { getDefaultRegex } from './utils';

const DEFAULT_INCLUDE_REGEX = /(.ts|.tsx|.js|.jsx|.java|.py|.go|.tf)$/;
const NOODLE_COMMENT_REGEX = /noodle\s+([<-])(?:-([a-z\s]+)-|-)([->])\s+([a-z0-9-]+)\s*(?:\(([a-z0-9-,]+)+\)|)/;
export const DEFAULT_FILES_WORKERS_NUM = 8;

export class Scanner {
    private readonly context: ScanContext;
    private readonly filesIteratorFactory = new FilesIteratorFactory();
    private readonly plugins: NoodlePlugin[];

    public constructor(options: ScanOptions, logger?: Logger) {
        this.context = {
            ...options,
            config: {
                ...options.config,
                include: getDefaultRegex(options.config.include, DEFAULT_INCLUDE_REGEX),
            },
            scanWorkersNum: options.scanWorkersNum ?? DEFAULT_FILES_WORKERS_NUM,
            logger,
        };
        this.plugins = options.config.plugins?.map((plugin) => new (require(plugin).default)()) ?? [];
    }

    public register(plugin: NoodlePlugin): void {
        this.plugins.push(plugin);
    }

    public async scan(): Promise<ScanResult> {
        const scannedResources: Resource[] = [];

        for (const resource of this.context.config.resources) {
            scannedResources.push(await this.scanResource(resource));
        }

        this.enrichResources(scannedResources);

        return { resources: scannedResources };
    }

    private async scanResource(resource: Resource): Promise<Resource> {
        const resourceCopy = {
            ...resource,
            source: inferSource(resource),
        };

        if (resourceCopy.source === 'config') return resource;

        this.context.logger?.debug({ id: resourceCopy.id, url: resourceCopy.url, source: resourceCopy.source }, 'Scanning resource...');

        const filesIterator = this.filesIteratorFactory.produce({ context: this.context, resource: resourceCopy });
        const filePathsGenerator = filesIterator.iterate();

        let filesScanned = 0;
        resourceCopy.relationships ??= [];
        await Promise.all(
            Array(this.context.scanWorkersNum)
                .fill(filePathsGenerator)
                .map(async (generator) => {
                    for await (const path of generator) {
                        filesScanned++;
                        resourceCopy.relationships!.push(...(await scanFile(filesIterator.settings, path)));
                    }
                })
        );

        this.context.logger?.info({ id: resourceCopy.id, filesScanned, relationships: resourceCopy.relationships.length }, 'Resource scanned');
        return resourceCopy;
    }

    private enrichResources(resources: Resource[]): void {
        this.enrichTags(resources);
        for (const plugin of this.plugins) {
            plugin.enrich(resources);
        }
    }

    // TBD: Should be a plugin?
    private enrichTags(resources: Resource[]): void {
        const resourcesEnrichments = new Map(resources.map((resource) => [resource.id, { tags: new Set(resource.tags) }]));

        for (const resource of resources) {
            for (const relationship of resource.relationships ?? []) {
                if (!resourcesEnrichments.has(relationship.resourceId)) {
                    resources.push({ id: relationship.resourceId, source: 'scan' });
                    resourcesEnrichments.set(relationship.resourceId, { tags: new Set() });
                }

                for (const tag of relationship.tags ?? []) {
                    resourcesEnrichments.get(resource.id)!.tags.add(tag);
                    resourcesEnrichments.get(relationship.resourceId)!.tags.add(tag);
                }
            }
        }

        for (const resource of resources) {
            resource.tags = [...resourcesEnrichments.get(resource.id)!.tags];
        }
    }
}

async function scanFile(iteratorSettings: FilesIteratorSettings, path: string): Promise<Relationship[]> {
    let currentLine = 0;
    return (await readFile(join(iteratorSettings.localBaseUrl, path)))
        .toString()
        .split('\n')
        .map((line) => {
            currentLine++;
            const matches = NOODLE_COMMENT_REGEX.exec(line);
            if (!matches) return null;
            return {
                action: matches[2] == null ? undefined : matches[2],
                resourceId: matches[4],
                tags: matches[5]?.split(',') ?? [],
                url: produceRelationshipUrl(iteratorSettings, path, currentLine++),
                from: matches[1] === '<',
                to: matches[3] === '>',
            };
        })
        .filter(Boolean) as Relationship[];
}

function produceRelationshipUrl(iteratorSettings: FilesIteratorSettings, path: string, line: number) {
    return iteratorSettings.github
        ? produceRelationshipUrlGitHub(iteratorSettings.url, iteratorSettings.github.branch, path, line)
        : produceRelationshipUrlLocal(iteratorSettings.localBaseUrl, path);
}

function produceRelationshipUrlLocal(baseUrl: string, path: string) {
    return 'file://' + join(baseUrl, path);
}

function produceRelationshipUrlGitHub(repoUrl: string, branch: string, path: string, line: number): string {
    const url = new URL(repoUrl);
    url.pathname = join(url.pathname, 'blob', branch, `${path}#L${line}`);
    return decodeURIComponent(url.toString());
}

function inferSource(resource: Resource): Source {
    if (!resource.url) return 'config';
    if (/^https?:\/\//.test(resource.url)) return 'github';
    return 'local';
}
