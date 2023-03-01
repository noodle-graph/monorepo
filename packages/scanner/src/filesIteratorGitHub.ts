import { MissingGitHubOptionsError, MissingUrlError } from './errors';
import { FilesIterator, FilesIteratorOptions } from './filesIterator';
import { FilesIteratorLocal } from './filesIteratorLocal';
import { GitClient } from './gitClient';
import { ScanOptions } from './scanner';
import { Resource } from './types';

export class FilesIteratorGitHub implements FilesIterator {
    constructor(private readonly filesIteratorLocal = new FilesIteratorLocal(), private readonly git = new GitClient()) {}

    produceOptions(scanOptions: ScanOptions & { scanWorkingDirectory: string }, resource: Resource): FilesIteratorOptions {
        if (!resource.url) throw new MissingUrlError(resource.id);
        if (!scanOptions.github) throw new MissingGitHubOptionsError(resource.id);

        return {
            resource,
            url: resource.url,
            localBaseUrl: scanOptions.scanWorkingDirectory,
            github: {
                ...scanOptions.github,
                ...resource.github,
                branch: resource.github?.branch ?? 'master',
            },
        };
    }

    async *iterate(options: FilesIteratorOptions): AsyncGenerator<string> {
        if (options.github == null) throw new MissingGitHubOptionsError(options.resource.id);

        await this.git.clone({
            repoUrl: options.url,
            localUrl: options.localBaseUrl,
            branch: options.github.branch,
            token: options.github.token,
        });

        const localIterator = this.filesIteratorLocal.iterate({
            ...options,
            url: '',
        });

        for await (const path of localIterator) yield path;
    }
}
