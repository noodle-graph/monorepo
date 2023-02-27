import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { simpleGit } from 'simple-git';

import { MissingGitHubOptions, MissingGitHubOptionsError, MissingUrlError } from './errors';
import { FilesIterator, FilesIteratorOptions } from './filesIterator';
import { FilesIteratorLocal } from './filesIteratorLocal';
import { ScanOptions } from './scanner';
import { Resource } from './types';

export class FilesIteratorGitHub implements FilesIterator {
    private readonly filesIteratorLocal = new FilesIteratorLocal();

    async produceOptions(scanOptions: ScanOptions, resource: Resource): Promise<FilesIteratorOptions> {
        if (!resource.url) throw new MissingUrlError(resource.id);
        if (!scanOptions.github) throw new MissingGitHubOptionsError(resource.id);

        return {
            resource,
            url: resource.url,
            localBaseUrl: await mkdtemp(join(tmpdir(), 'noodle-')),
            github: {
                ...scanOptions.github,
                ...resource.github,
                branch: resource.github?.branch ?? 'master',
            },
        };
    }

    async *iterate(options: FilesIteratorOptions): AsyncGenerator<string> {
        if (options.github == null) throw new MissingGitHubOptions();

        const url = new URL(options.url);
        url.username = options.github.token;

        await simpleGit().clone(url.toString(), options.localBaseUrl, {
            '--depth': 1,
            '--single-branch': null,
            '--branch': options.github.branch,
        });

        const localIterator = this.filesIteratorLocal.iterate({ ...options, url: options.localBaseUrl });

        for await (const path of localIterator) yield path;
    }
}
