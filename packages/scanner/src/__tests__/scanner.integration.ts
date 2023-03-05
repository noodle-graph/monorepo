import type { Resource, ScanOptions } from '@noodle-graph/types';

import { scan } from '..';

describe('Scanner', () => {
    let scanOptions: ScanOptions;
    let expectedResources: Resource[];

    describe('with 1 github resource', () => {
        beforeEach(() => {
            const resource = {
                id: 'some-resource',
                url: 'https://github.com/noodle-graph/monorepo',
                include: 'scanner/src/__mocks__/data/.*\\.js$',
            };
            const githubToken = process.env.NOODLE_GITHUB_TOKEN;
            expect(githubToken).toBeTruthy();
            scanOptions = {
                config: { resources: [resource] },
                github: {
                    token: githubToken!,
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
