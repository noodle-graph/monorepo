import { join } from 'path';

import type { Source, Resource } from '@noodle-graph/types';

import type { FilesIterator } from '../filesIterator';
import { FilesIteratorLocal } from '../filesIteratorLocal';
import { DEFAULT_FILES_WORKERS_NUM } from '../scanner';
import type { ScanContext } from '../types';

describe('FilesIteratorLocal', () => {
    let context: ScanContext;
    let filesIterator: FilesIterator;

    beforeEach(() => {
        const resource: Resource & { source: Source } = {
            id: 'some-resource',
            url: 'someResource',
            source: 'local',
        };
        context = {
            scanWorkingDirectory: join(__dirname, '../__mocks__/data'),
            scanWorkersNum: DEFAULT_FILES_WORKERS_NUM,
            config: { resources: [resource], include: /.*/ },
        };
        filesIterator = new FilesIteratorLocal({
            context,
            resource,
        });
    });

    it('iterates correctly', async () => {
        const paths: string[] = [];
        for await (const path of filesIterator.iterate()) paths.push(path);

        expect(paths).toEqual(['someResource/callingAnotherService.js', 'someResource/callingDb.js', 'someResource/inner/folder/callingQueue.js', 'someResource/noNoodleHere.js']);
    });
});
