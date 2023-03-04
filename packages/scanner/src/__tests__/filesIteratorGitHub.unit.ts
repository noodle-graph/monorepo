import { join } from 'path';

import { MissingGitHubOptionsError, MissingUrlError } from '../errors';
import { FilesIteratorGitHub } from '../filesIteratorGitHub';
import { DEFAULT_FILES_WORKERS_NUM } from '../scanner';
import type { Resource, ScanContext, Source } from '../types';

describe('FilesIteratorGitHub', () => {
    let resource: Resource & { source: Source };
    let context: ScanContext;

    beforeEach(() => {
        resource = {
            id: 'some-resource',
            url: 'someResource',
            source: 'github',
        };
        context = {
            scanWorkingDirectory: join(__dirname, '../__mocks__/data'),
            scanWorkersNum: DEFAULT_FILES_WORKERS_NUM,
            config: { resources: [resource], include: /.*/ },
            github: {
                token: 'some-token',
            },
        };
    });

    describe('without GitHub options', () => {
        beforeEach(() => {
            context.github = undefined;
        });
        it('cant construct', async () => {
            expect(() => new FilesIteratorGitHub({ context, resource })).toThrow(MissingGitHubOptionsError);
        });
    });

    describe('without URL options', () => {
        beforeEach(() => {
            resource.url = undefined;
        });
        it('cant construct', async () => {
            expect(() => new FilesIteratorGitHub({ context, resource })).toThrow(MissingUrlError);
        });
    });
});
