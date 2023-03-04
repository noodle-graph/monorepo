import { FilesIteratorFactory } from '../filesIteratorFactory';
import { FilesIteratorGitHub } from '../filesIteratorGitHub';
import { FilesIteratorLocal } from '../filesIteratorLocal';
import type { Resource, ScanContext, Source } from '../types';

describe('FilesIteratorRegistry', () => {
    const factory = new FilesIteratorFactory();
    const context: ScanContext = {
        scanWorkersNum: 0,
        config: { resources: [], include: /.*/ },
        github: { token: 'some token' },
    };
    const resource: Resource = {
        id: 'some-resource',
        url: 'some-url',
    };

    describe.each([
        ['local', FilesIteratorLocal],
        ['github', FilesIteratorGitHub],
    ])("when source is '%s'", (source, expected) => {
        it(`should return ${expected}`, () => {
            expect(
                factory.produce({
                    context,
                    resource: {
                        ...resource,
                        source: source as Source,
                    },
                })
            ).toBeInstanceOf(expected);
        });
    });
});
