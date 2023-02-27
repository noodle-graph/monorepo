import fs from 'fs';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { clone, listFiles } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

import { MissingGitHubOptions, MissingGitHubOptionsError, MissingUrlError } from './errors';
import { FilesIterator, FilesIteratorOptions } from './filesIterator';
import { ScanOptions } from './scanner';
import { Resource } from './types';

export class FilesIteratorGitHub implements FilesIterator {
    async produceOptions(scanOptions: ScanOptions, resource: Resource): Promise<FilesIteratorOptions> {
        if (!resource.url) throw new MissingUrlError(resource.id);
        if (!scanOptions.github) throw new MissingGitHubOptionsError(resource.id);

        return {
            resource,
            url: resource.url,
            localDirUrl: await mkdtemp(join(tmpdir(), 'noodle-')),
            github: {
                ...scanOptions.github,
                ...resource.github,
                ref: resource.github?.ref ?? 'master',
            },
        };
    }

    async *iterate({ url, localDirUrl: baseUrl, github }: FilesIteratorOptions): AsyncGenerator<string> {
        if (github == null) throw new MissingGitHubOptions();

        const dir = baseUrl;

        await clone({
            fs,
            dir,
            url,
            ref: github.ref,
            http,
            singleBranch: true,
            onAuth: () => ({ username: github.token, password: '' }),
        });

        for (const filePath of await listFiles({ fs, dir, ref: github.ref })) {
            yield filePath;
        }
    }
}
