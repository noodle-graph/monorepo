import { FilesIterator } from './filesIterator';
import { FilesIteratorGitHub } from './filesIteratorGitHub';
import { FilesIteratorLocal } from './filesIteratorLocal';
import { Source } from './types';

export class FilesIteratorsRegistry {
    private readonly filesIterators: { [P in Source]: FilesIterator } = {
        github: new FilesIteratorGitHub(),
        local: new FilesIteratorLocal(),
        config: undefined as never,
        scan: undefined as never,
    };

    public get(source: Source): FilesIterator {
        return this.filesIterators[source];
    }
}
