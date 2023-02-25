import { readdir } from 'fs/promises';
import { join } from 'path';

import { FilesIterator, ListTypeOptions } from './filesIterator';

export class FilesIteratorLocal implements FilesIterator {
    iterate(options: ListTypeOptions): AsyncGenerator<string> {
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
