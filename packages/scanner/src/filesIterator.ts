export interface ListTypeOptions {
    url: string;
    github?: {
        token?: string;
        ref?: string;
    };
}

export interface FilesIterator {
    listFiles(options: ListTypeOptions): Promise<string[]>;
}
