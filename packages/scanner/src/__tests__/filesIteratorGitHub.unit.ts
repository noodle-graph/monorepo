import { join } from 'path';

import { GitClientMock } from '../__mocks__/gitClientMock';
import { MissingGitHubOptionsError, MissingUrlError } from '../errors';
import { FilesIteratorOptions } from '../filesIterator';
import { FilesIteratorGitHub } from '../filesIteratorGitHub';
import type { ScanOptions } from '../scanner';
import type { Resource } from '../types';

describe('FilesIteratorGitHub', () => {
    let resource: Resource;
    let scanOptions: ScanOptions & { scanWorkingDirectory: string };
    let filesIterator: FilesIteratorGitHub;

    beforeEach(() => {
        resource = {
            id: 'some-resource',
            url: 'someResource',
            source: 'github',
        };
        scanOptions = {
            scanWorkingDirectory: join(__dirname, '../__mocks__/data'),
            config: { resources: [resource] },
            github: {
                token: 'some-token',
            },
        };
        filesIterator = new FilesIteratorGitHub(undefined, new GitClientMock());
    });

    describe('with options of a non-empty resource', () => {
        let options: FilesIteratorOptions;
        beforeEach(async () => {
            options = await filesIterator.produceOptions(scanOptions, scanOptions.config.resources[0]);
        });

        it('have correct options', () => {
            expect(options).toEqual({
                resource,
                url: resource.url,
                localBaseUrl: scanOptions.scanWorkingDirectory,
                github: {
                    branch: 'master',
                    token: scanOptions.github!.token,
                },
            });
        });

        it('iterates correctly', async () => {
            const paths: string[] = [];
            for await (const path of filesIterator.iterate(options)) paths.push(path);

            expect(paths).toEqual([
                'someResource/callingAnotherService.js',
                'someResource/callingDb.js',
                'someResource/inner/folder/callingQueue.js',
                'someResource/noNoodleHere.js',
            ]);
        });

        describe('without GitHub options', () => {
            beforeEach(() => {
                options.github = undefined;
            });
            it('cant iterate', async () => {
                await expect(filesIterator.iterate(options).next()).rejects.toThrow(MissingGitHubOptionsError);
            });
        });
    });

    describe('with no URL', () => {
        beforeEach(() => {
            resource.url = undefined;
            scanOptions.config.resources = [resource];
        });

        it('cant create options', () => {
            expect(() => filesIterator.produceOptions(scanOptions, scanOptions.config.resources[0])).toThrow(MissingUrlError);
        });
    });

    describe('with no GitHub options', () => {
        beforeEach(() => {
            scanOptions.github = undefined;
        });

        it('cant create options', () => {
            expect(() => filesIterator.produceOptions(scanOptions, scanOptions.config.resources[0])).toThrow(MissingGitHubOptionsError);
        });
    });
});
