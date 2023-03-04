import type { FilesIteratorSettings, ResourceScanContext } from './types';

export interface FilesIteratorConstructor {
    new (options: ResourceScanContext): FilesIterator;
}

export interface FilesIterator {
    readonly settings: FilesIteratorSettings;
    iterate(): AsyncGenerator<string>;
}
