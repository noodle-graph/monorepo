/* istanbul ignore file */
// TODO: Add tests

import { readFile } from 'fs/promises';
import { join, isAbsolute } from 'path';

import { Logger } from 'pino';

import { FilesIteratorOptions } from './filesIterator';
import { FilesIteratorsRegistry } from './filesIteratorsRegistry';
import { Relationship, Resource, ScanConfig, ScanResult, Source } from './types';

const NOODLE_COMMENT_REGEX = /noodle\s+([<-])(?:-([a-z\s]+)-|-)([->])\s+([a-z0-9-]+)\s*(?:\(([a-z0-9-,]+)+\)|)/;
const DEFAULT_INCLUDE_REGEX = /(.ts|.tsx|.js|.jsx|.java|.py|.go|.tf)$/;
export const DEFAULT_FILES_WORKERS_NUM = 8;

export interface ScanOptions {
    config: ScanConfig;
    github?: { token: string };
    scanWorkersNum?: number;
    scanWorkingDirectory: string;
}

export class Scanner {
    private readonly defaultInclude: RegExp;

    constructor(private readonly options: ScanOptions, private readonly logger?: Logger, private readonly filesIteratorsRegistry = new FilesIteratorsRegistry()) {
        this.options.scanWorkersNum ??= DEFAULT_FILES_WORKERS_NUM;
        this.defaultInclude = getDefaultRegex(this.options.config.include, DEFAULT_INCLUDE_REGEX);
    }

    async scan(): Promise<ScanResult> {
        const scannedResources: Resource[] = [];

        for (const resource of this.options.config.resources) {
            scannedResources.push(await this.scanResource(resource));
        }

        enrichResources(scannedResources);

        return { ...this.options.config, resources: scannedResources };
    }

    private async scanResource(resource: Resource): Promise<Resource> {
        const source = inferSource(resource);
        if (source === 'config') return { ...resource, source };

        this.logger?.debug({ resourceId: resource.id, url: resource.url, source }, 'Scanning resource...');

        const filesIterator = this.filesIteratorsRegistry.get(source);
        const filesIteratorOptions = await filesIterator.produceOptions(this.options, resource);
        const filePathsGenerator = filesIterator.iterate(filesIteratorOptions);

        let filesScanned = 0;
        const relationships: Relationship[] = [];
        await Promise.all(
            Array(this.options.scanWorkersNum)
                .fill(filePathsGenerator)
                .map(async (generator) => {
                    for await (const path of generator) {
                        if (getDefaultRegex(resource.include, this.defaultInclude).test(path)) {
                            filesScanned++;
                            relationships.push(...(await extractRelationships(filesIteratorOptions, path)));
                        }
                    }
                })
        );

        this.logger?.info({ resourceId: resource.id, filesScanned, relationships: relationships.length }, 'Resource scanned');

        return { ...resource, source, url: filesIteratorOptions.url, relationships };
    }
}

function enrichResources(scannedResources: Resource[]) {
    const resourcesEnrichments = new Map(scannedResources.map((resource) => [resource.id, { tags: new Set(resource.tags) }]));

    for (const resource of scannedResources) {
        for (const relationship of resource.relationships ?? []) {
            if (!resourcesEnrichments.has(relationship.resourceId)) {
                scannedResources.push({ id: relationship.resourceId, source: 'scan' });
                resourcesEnrichments.set(relationship.resourceId, { tags: new Set() });
            }

            for (const tag of relationship.tags ?? []) {
                resourcesEnrichments.get(resource.id)!.tags.add(tag);
                resourcesEnrichments.get(relationship.resourceId)!.tags.add(tag);
            }
        }
    }

    for (const resource of scannedResources) {
        resource.tags = [...resourcesEnrichments.get(resource.id)!.tags];
    }
}

async function extractRelationships(options: FilesIteratorOptions, path: string): Promise<Relationship[]> {
    let currentLine = 0;
    return (await readFile(inferPath(options.localBaseUrl, path)))
        .toString()
        .split('\n')
        .map((line) => {
            currentLine++;
            const matches = NOODLE_COMMENT_REGEX.exec(line);
            if (!matches) return null;
            return {
                action: matches[2] === '-' || matches[2] == null ? undefined : matches[2],
                resourceId: matches[4],
                tags: matches[5]?.split(',') ?? [],
                url: produceRelationshipUrl(options, path, currentLine++),
                from: matches[1] === '<',
                to: matches[3] === '>',
            };
        })
        .filter(Boolean) as Relationship[];
}

function produceRelationshipUrl(options: FilesIteratorOptions, path: string, currentLine: number) {
    return options.github ? produceRelationshipUrlGitHub(options.url, options.github.branch, path, currentLine) : produceRelationshipUrlLocal(options.localBaseUrl, path);
}

function produceRelationshipUrlLocal(baseUrl: string, path: string) {
    return 'file://' + inferPath(baseUrl, path);
}

function produceRelationshipUrlGitHub(repoUrl: string, branch: string, path: string, line: number): string {
    return join(repoUrl, 'blob', branch, `${path}#L${line}`);
}

function inferSource(resource: Resource): Source {
    if (!resource.url) return 'config';
    if (/^https?:\/\//.test(resource.url)) return 'github';
    return 'local';
}

function inferPath(baseUrl: string, path: string) {
    return isAbsolute(path) ? path : join(baseUrl, path);
}

function getDefaultRegex(pattern: string | RegExp | undefined, defaultPattern: RegExp): RegExp {
    return typeof pattern === 'string' ? new RegExp(pattern) : defaultPattern;
}
