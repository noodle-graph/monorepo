import type { Relationship } from '@noodle-graph/types';

export function everyIncludes<T>(arrEvery: T[], arrIncludes: T[]) {
    return arrEvery.every((x) => arrIncludes.includes(x));
}

export function produceRelationship(relationship: Partial<Relationship> & { resourceId: string }) {
    return {
        from: false,
        to: true,
        ...relationship,
    };
}
