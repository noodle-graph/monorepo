import { join } from 'path';

import { MissingUrlError } from '../errors';
import { FilesIteratorOptions } from '../filesIterator';
import { FilesIteratorLocal } from '../filesIteratorLocal';
import type { ScanOptions } from '../scanner';
import type { Resource } from '../types';

describe('FilesIteratorRegistry', () => {
    let resource: Resource;
    let scanOptions: ScanOptions;
    let filesIterator: FilesIteratorLocal;

    beforeEach(() => {
        resource = {
            id: 'some-resource',
            url: 'someResource',
        };
        scanOptions = {
            scanWorkingDirectory: join(__dirname, 'data'),
            config: { resources: [resource] },
        };
        filesIterator = new FilesIteratorLocal();
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
});
