export interface ListTypeOptions {
    url: string;
    github?: {
        token?: string;
        ref?: string;
    };
}

export interface FilesIterator {
    iterate(options: ListTypeOptions): AsyncGenerator<string>;
}
