import { readdir } from 'fs/promises';
import { join } from 'path';

import { FilesIterator } from './filesIterator';
import type { FilesIteratorSettings, ResourceScanContext } from './types';
import { getDefaultRegex } from './utils';

export class FilesIteratorLocal implements FilesIterator {
    public readonly settings: FilesIteratorSettings;

    constructor(options: ResourceScanContext) {
        this.settings = {
            resource: options.resource,
            url: options.resource.url ?? '',
            localBaseUrl: options.context.scanWorkingDirectory ?? process.cwd(),
            include: getDefaultRegex(options.resource.include, options.context.config.include),
        };
    }

    async *iterate(): AsyncGenerator<string> {
        for await (const path of this.deepReadDir(join(this.settings.localBaseUrl, this.settings.url))) {
            yield path.substring(this.settings.localBaseUrl.length + 1);
        }
    }

    private async *deepReadDir(dirPath: string): AsyncGenerator<string> {
        for (const dirent of await readdir(dirPath, { withFileTypes: true })) {
            const direntPath = join(dirPath, dirent.name);
            if (dirent.isDirectory()) {
                for await (const path of this.deepReadDir(direntPath)) yield path;
            } else if (this.settings.include.test(direntPath)) {
                yield direntPath;
            }
        }
    }
}
