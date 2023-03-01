import { join } from 'path';

import { Scanner, ScanOptions } from '../scanner';
import { Resource } from '../types';

describe('Scanner', () => {
    let scanner: Scanner;
    let scanOptions: ScanOptions & { scanWorkingDirectory: string };
    let expectedResources: Resource[];

    describe('with 1 resource', () => {
        beforeEach(() => {
            const resource = {
                id: 'some-resource',
                url: 'someResource',
            };
            scanOptions = {
                scanWorkingDirectory: join(__dirname, 'data'),
                config: { resources: [resource] },
            };
            scanner = new Scanner(scanOptions);
            expectedResources = expect.arrayContaining([
                {
                    ...resource,
                    source: 'local',
                    tags: ['tag1'],
                    relationships: expect.arrayContaining([
                        {
                            resourceId: 'another-resource',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory, 'someResource/callingAnotherService.js'),
                            action: undefined,
                            from: false,
                            to: true,
                            tags: [],
                        },
                        {
                            resourceId: 'some-db',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory, 'someResource/callingDb.js'),
                            action: undefined,
                            from: false,
                            to: true,
                            tags: ['tag1'],
                        },
                        {
                            resourceId: 'some-queue',
                            url: 'file://' + join(scanOptions.scanWorkingDirectory, 'someResource/inner/folder/callingQueue.js'),
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
            ]);
        });

        it('should scan correctly', async () => {
            expect(await scanner.scan()).toEqual({ resources: expectedResources });
        });
    });
});
