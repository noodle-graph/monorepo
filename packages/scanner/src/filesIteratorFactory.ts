import { FilesIterator } from './filesIterator';
import type { FilesIteratorConstructor } from './filesIterator';
import { FilesIteratorGitHub } from './filesIteratorGitHub';
import { FilesIteratorLocal } from './filesIteratorLocal';
import type { ResourceScanContext, Source } from './types';

export class FilesIteratorFactory {
    private readonly filesIteratorsClass: { [P in Source]: FilesIteratorConstructor } = {
        github: FilesIteratorGitHub,
        local: FilesIteratorLocal,
        config: undefined as never,
        scan: undefined as never,
    };

    public produce(context: ResourceScanContext): FilesIterator {
        return new this.filesIteratorsClass[context.resource.source](context);
    }
}
