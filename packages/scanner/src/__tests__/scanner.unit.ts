import { cp, mkdir } from 'fs/promises';
import { join } from 'path';

import { scan } from '..';
import { GitClient } from '../gitClient';
import { ScanOptions } from '../scanner';
import { Resource } from '../types';

describe('Scanner', () => {
    let scanOptions: ScanOptions;
    let expectedResources: Resource[];

    describe('with 1 local resource', () => {
        beforeEach(() => {
            const resource = {
                id: 'some-resource',
                url: 'someResource',
            };
            scanOptions = {
                scanWorkingDirectory: join(__dirname, '../__mocks__/data'),
                config: { resources: [resource] },
            };

            expectedResources = [
                {
                    ...resource,
                    source: 'local',
                    tags: ['tag1'],
                    relationships: expect.arrayContaining([
                        {
                            resourceId: 'another-resource',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory!, 'someResource/callingAnotherService.js'),
                            action: 'calls',
                            from: false,
                            to: true,
                            tags: [],
                        },
                        {
                            resourceId: 'some-db',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory!, 'someResource/callingDb.js'),
                            action: undefined,
                            from: false,
                            to: true,
                            tags: ['tag1'],
                        },
                        {
                            resourceId: 'some-queue',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory!, 'someResource/inner/folder/callingQueue.js'),
                            action: undefined,
                            from: false,
                            to: true,
                            tags: [],
                        },
                    ]),
                },
                {
                    id: 'another-resource',
                    source: 'scan',
                    tags: [],
                },
                {
                    id: 'some-db',
                    source: 'scan',
                    tags: ['tag1'],
                },
                {
                    id: 'some-queue',
                    source: 'scan',
                    tags: [],
                },
            ];
        });

        it('should scan correctly', async () => {
            expect(await scan(scanOptions)).toEqual({ resources: expect.arrayContaining(expectedResources) });
        });

        describe('with 1 config resource and logger', () => {
            beforeEach(() => {
                scanOptions.config.resources.push({ id: 'some-queue', source: 'config' });
                expectedResources.find((resource) => resource.id === 'some-queue')!.source = 'config';
            });

            it('should scan correctly', async () => {
                expect(await scan(scanOptions)).toEqual({ resources: expect.arrayContaining(expectedResources) });
            });
        });
    });

    describe('with 1 github resource', () => {
        beforeEach(() => {
            jest.spyOn(GitClient.prototype, 'clone').mockImplementation(async (options) => {
                // Pretend the repo is cloned, but only with the test data.
                const dataFolderCopyPath = join(options.localUrl, 'packages/scanner/src/__mocks__/data');
                await mkdir(dataFolderCopyPath, { recursive: true });
                await cp(join(__dirname, '../__mocks__/data'), dataFolderCopyPath, { recursive: true });
            });

            const resource = {
                id: 'some-resource',
                url: 'https://github.com/noodle-graph/monorepo',
                include: 'scanner/src/__mocks__/data/.*\\.js$',
            };
            scanOptions = {
                config: { resources: [resource] },
                github: {
                    token: 'some-token',
                },
            };
            expectedResources = [
                {
                    ...resource,
                    source: 'github',
                    tags: ['tag1'],
                    relationships: expect.arrayContaining([
                        {
                            resourceId: 'another-resource',
                            url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/callingAnotherService.js#L3',
                            action: 'calls',
                            from: false,
                            to: true,
                            tags: [],
                        },
                        {
                            resourceId: 'some-db',
                            url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/callingDb.js#L3',
                            action: undefined,
                            from: false,
                            to: true,
                            tags: ['tag1'],
                        },
                        {
                            resourceId: 'some-queue',
                            url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/inner/folder/callingQueue.js#L3',
                            action: undefined,
                            from: false,
                            to: true,
                            tags: [],
                        },
                    ]),
                },
                {
                    id: 'another-resource',
                    source: 'scan',
                    tags: [],
                },
                {
                    id: 'some-db',
                    source: 'scan',
                    tags: ['tag1'],
                },
                {
                    id: 'some-queue',
                    source: 'scan',
                    tags: [],
                },
            ];
        });

        it('should scan correctly', async () => {
            expect(await scan(scanOptions)).toEqual({ resources: expect.arrayContaining(expectedResources) });
        });
    });
});
