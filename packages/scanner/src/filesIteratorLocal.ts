import { readdir } from 'fs/promises';
import { join } from 'path';

import { FilesIterator, ListTypeOptions } from './filesIterator';

export class FilesIteratorLocal implements FilesIterator {
    async listFiles(options: ListTypeOptions): Promise<string[]> {
        return (await deepReadDir(options.url)).flat(Number.POSITIVE_INFINITY);
    }
}

async function deepReadDir(dirPath) {
    return await Promise.all(
        (
            await readdir(dirPath, { withFileTypes: true })
        ).map(async (dirent) => {
            const path = join(dirPath, dirent.name);
            return dirent.isDirectory() ? await deepReadDir(path) : path;
        })
    );
}
