import fs from 'fs/promises';

import { MissingUrlError } from './errors';
import { FilesIteratorsRegistry } from './filesIteratorsRegistry';
import { Relationship, Resource, ScanConfig, ScanResult, Source } from './types';

const FILES_INCLUDE_REGEX = /(.ts|.tsx|.js|.jsx|.java|.py|.go|.tf)$/;
const NOODLE_COMMENT_REGEX = /noodle\s+(-|<)-([a-z\s]+)-(>|-)\s+([a-z0-9-]+)\s+(?:\(([a-z0-9-,]+)+\)|)/;

export interface ScanOptions {
    config: ScanConfig;
    github?: { token: string };
}

export class Scanner {
    constructor(private readonly options: ScanOptions, private filesIteratorsRegistry = new FilesIteratorsRegistry()) {}

    async scan(): Promise<ScanResult> {
        return {
            resources: await Promise.all(this.options.config.resources.map((r) => this.scanResource(r))),
        };
    }

    private async scanResource(resource: Resource): Promise<Resource> {
        const source = inferSource(resource);
        const url = resource.url;

        if (source === 'config') return resource;
        if (!url) throw new MissingUrlError(resource.id);

        const filePaths = await this.filesIteratorsRegistry.get(source).listFiles({ url, github: { ...this.options.github, ...resource.github } });
        const relationships = (
            await Promise.all(
                filePaths
                    .filter((filePath) => FILES_INCLUDE_REGEX.test(filePath))
                    .map(async (filePath) => (await fs.readFile(filePath)).toString())
                    .map(async (contentPromise) => extractRelationships(url, await contentPromise))
            )
        ).flat();

        return { ...resource, source, relationships };
    }
}

export function extractRelationships(path: string, content: string): Relationship[] {
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
