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
            localDirUrl: scanOptions.scanWorkingDirectory,
        });
    }

    iterate(options: FilesIteratorOptions): AsyncGenerator<string> {
        return deepReadDir(options.url);
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
