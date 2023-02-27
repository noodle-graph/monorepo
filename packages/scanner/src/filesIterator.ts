import { ScanOptions } from './scanner';
import { Resource } from './types';

export interface FilesIteratorOptions {
    resource: Resource;
    url: string;
    localBaseUrl: string;
    github?: {
        token: string;
        branch: string;
    };
}

export interface FilesIterator {
    produceOptions(scanOptions: ScanOptions, resource: Resource): Promise<FilesIteratorOptions>;
    iterate(options: FilesIteratorOptions): AsyncGenerator<string>;
}
