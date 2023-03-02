import { FilesIteratorGitHub } from '../filesIteratorGitHub';
import { FilesIteratorLocal } from '../filesIteratorLocal';
import { FilesIteratorsRegistry } from '../filesIteratorsRegistry';
import type { Source } from '../types';

describe('FilesIteratorRegistry', () => {
    let registry: FilesIteratorsRegistry;

    beforeEach(() => {
        registry = new FilesIteratorsRegistry();
    });

    describe.each([
        ['local', FilesIteratorLocal],
        ['github', FilesIteratorGitHub],
    ])("when source is '%s'", (source, expected) => {
        it(`should return ${expected}`, () => {
            expect(registry.get(source as Source)).toBeInstanceOf(expected);
        });
    });
});
