import fs from 'fs/promises';

import { Logger } from 'pino';

import { MissingUrlError } from './errors';
import { FilesIteratorsRegistry } from './filesIteratorsRegistry';
import { Relationship, Resource, ScanConfig, ScanResult, Source } from './types';

const NOODLE_COMMENT_REGEX = /noodle\s+(-|<)-([a-z\s]+)-(>|-)\s+([a-z0-9-]+)\s+(?:\(([a-z0-9-,]+)+\)|)/;
const DEFAULT_INCLUDE_REGEX = /(.ts|.tsx|.js|.jsx|.java|.py|.go|.tf)$/;
const DEFAULT_FILES_WORKERS_NUM = 8;

export interface ScanOptions {
    config: ScanConfig;
    github?: { token: string };
    scanWorkersNum?: number;
}

export class Scanner {
    private readonly defaultInclude: RegExp;

    constructor(private readonly options: ScanOptions, private readonly logger: Logger, private readonly filesIteratorsRegistry = new FilesIteratorsRegistry()) {
        this.options.scanWorkersNum ??= DEFAULT_FILES_WORKERS_NUM;
        this.defaultInclude = getDefaultRegex(this.options.config.include, DEFAULT_INCLUDE_REGEX);
    }

    async scan(): Promise<ScanResult> {
        const scannedResources: Resource[] = [];

        for (const resource of this.options.config.resources) {
            this.logger.debug({ resourceId: resource.id }, 'Scanning resource...');
            scannedResources.push(await this.scanResource(resource));
        }

        return { ...this.options.config, resources: scannedResources };
    }

    private async scanResource(resource: Resource): Promise<Resource> {
        const source = inferSource(resource);
        const url = resource.url;

        if (source === 'config') return resource;
        if (!url) throw new MissingUrlError(resource.id);

        const filePathsGenerator = this.filesIteratorsRegistry.get(source).iterate({ url, github: { ...this.options.github, ...resource.github } });

        const relationships: Relationship[] = [];
        await Promise.all(
            Array(this.options.scanWorkersNum)
                .fill(filePathsGenerator)
                .map(async (generator) => {
                    for await (const path of generator) {
                        if (getDefaultRegex(resource.include, this.defaultInclude).test(path)) {
                            const content = (await fs.readFile(path)).toString();
                            relationships.push(...extractRelationships(url, content));
                        }
                    }
                })
        );

        return { ...resource, source, relationships };
    }
}

function getDefaultRegex(pattern: string | RegExp | undefined, defaultPattern: RegExp): RegExp {
    return typeof pattern === 'string' ? new RegExp(pattern) : defaultPattern;
}

function extractRelationships(path: string, content: string): Relationship[] {
    return content
        .split('\n')
        .map((line) => NOODLE_COMMENT_REGEX.exec(line))
        .filter(Boolean)
        .map((matches) => matches!) // TypeScript filter inference is not great
        .map((matches) => ({
            action: matches[2],
            resourceId: matches[4],
            tags: matches[5].split(','),
            url: path, // FIXME: This is not a permalink
            from: matches[1] === '<',
            to: matches[3] === '>',
        }));
}

function inferSource(resource: Resource): Source {
    if (!resource.url) return 'config';
    if (/^https?:\/\//.test(resource.url)) return 'github';
    return 'local';
}
