import { readdir } from 'fs/promises';
import { join } from 'path';

import { MissingUrlError } from './errors';
import { FilesIterator, FilesIteratorOptions } from './filesIterator';
import { ScanOptions } from './scanner';
import { Resource } from './types';

export class FilesIteratorLocal implements FilesIterator {
    produceOptions(scanOptions: ScanOptions, resource: Resource): Promise<FilesIteratorOptions> {
        if (!resource.url) throw new MissingUrlError(resource.id);

        return Promise.resolve({
            resource,
            url: resource.url,
            localBaseUrl: scanOptions.scanWorkingDirectory,
        });
    }

    async *iterate(options: FilesIteratorOptions): AsyncGenerator<string> {
        for await (const path of deepReadDir(join(options.localBaseUrl, options.url))) {
            yield path.substring(options.localBaseUrl.length + 1);
        }
    }
}

async function* deepReadDir(dirPath: string): AsyncGenerator<string> {
    for (const dirent of await readdir(dirPath, { withFileTypes: true })) {
        const direntPath = join(dirPath, dirent.name);
        if (dirent.isDirectory()) {
            for await (const path of deepReadDir(direntPath)) yield path;
        } else {
            yield direntPath;
        }
    }
}
