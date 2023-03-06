import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { MissingGitHubOptionsError, MissingUrlError } from './errors';
import type { FilesIterator } from './filesIterator';
import { FilesIteratorLocal } from './filesIteratorLocal';
import { GitClient } from './gitClient';
import type { FilesIteratorGitHubSettings, FilesIteratorSettings, ResourceScanContext } from './types';

export class FilesIteratorGitHub implements FilesIterator {
    public readonly settings: FilesIteratorSettings & { readonly github: FilesIteratorGitHubSettings };

    private readonly filesIteratorLocal: FilesIteratorLocal;
    private readonly git = new GitClient();

    public constructor(options: ResourceScanContext) {
        if (!options.resource.url) throw new MissingUrlError(options.resource.id);
        if (!options.context.github) throw new MissingGitHubOptionsError(options.resource.id);

        this.settings = {
            resource: options.resource,
            url: options.resource.url,
            localBaseUrl: options.context.scanWorkingDirectory ?? mkdtempSync(join(tmpdir(), 'noodle-')),
            include: options.context.config.include,
            github: {
                ...options.context.github,
                ...options.resource.github,
                branch: options.resource.github?.branch ?? 'master',
            },
        };

        this.filesIteratorLocal = new FilesIteratorLocal({
            context: { ...options.context, scanWorkingDirectory: this.settings.localBaseUrl },
            resource: { ...options.resource, url: '' },
        });
    }

    public async *iterate(): AsyncGenerator<string> {
        await this.git.clone({
            repoUrl: this.settings.url,
            localUrl: this.settings.localBaseUrl,
            branch: this.settings.github.branch,
            token: this.settings.github.token,
        });

        const localIterator = this.filesIteratorLocal.iterate();

        for await (const path of localIterator) yield path;
    }
}
