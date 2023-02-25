import { readFile } from 'fs/promises';
import { join, isAbsolute } from 'path';

import { Logger } from 'pino';

import { MissingUrlError } from './errors';
import { FilesIteratorsRegistry } from './filesIteratorsRegistry';
import { Relationship, Resource, ScanConfig, ScanResult, Source } from './types';

const NOODLE_COMMENT_REGEX = /noodle\s+(-|<)-([a-z\s]+)-(>|-)\s+([a-z0-9-]+)\s+(?:\(([a-z0-9-,]+)+\)|)/;
const DEFAULT_INCLUDE_REGEX = /(.ts|.tsx|.js|.jsx|.java|.py|.go|.tf)$/;
export const DEFAULT_FILES_WORKERS_NUM = 8;

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
            scannedResources.push(await this.scanResource(resource));
        }

        return { ...this.options.config, resources: scannedResources };
    }

    private async scanResource(resource: Resource): Promise<Resource> {
        const source = inferSource(resource);

        if (source === 'config') return resource;
        if (!resource.url) throw new MissingUrlError(resource.id);

        const url = source === 'local' && !isAbsolute(resource.url) ? join(process.cwd(), resource.url) : resource.url;

        this.logger.debug({ resourceId: resource.id, url, source }, 'Scanning resource...');
        const filePathsGenerator = this.filesIteratorsRegistry.get(source).iterate({ url, github: { ...this.options.github, ...resource.github } });

        let filesScanned = 0;
        const relationships: Relationship[] = [];
        await Promise.all(
            Array(this.options.scanWorkersNum)
                .fill(filePathsGenerator)
                .map(async (generator) => {
                    for await (const path of generator) {
                        if (getDefaultRegex(resource.include, this.defaultInclude).test(path)) {
                            filesScanned++;
                            const content = (await readFile(path)).toString();
                            relationships.push(...extractRelationships(url, content));
                        }
                    }
                })
        );

        this.logger.info({ resourceId: resource.id, filesScanned, relationships: relationships.length }, 'Resource scanned');

        return { ...resource, source, url, relationships };
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
