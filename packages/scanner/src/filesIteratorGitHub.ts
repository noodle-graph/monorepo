import fs from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { clone, listFiles } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

import { MissingGitHubOptions } from './errors';
import { FilesIterator, ListTypeOptions } from './filesIterator';

export class FilesIteratorGitHub implements FilesIterator {
    async *iterate({ url, github }: ListTypeOptions): AsyncGenerator<string> {
        if (github == null) throw new MissingGitHubOptions();

        const dir = fs.mkdtempSync(join(tmpdir(), 'noodle-'));

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
            yield join(dir, filePath);
        }
    }
}
