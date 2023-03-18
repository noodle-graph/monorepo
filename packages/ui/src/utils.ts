import type { Relationship } from '@noodle-graph/types';

export function everyIncludes<T>(arrEvery: T[], arrIncludes: T[]) {
    return arrEvery.every((x) => arrIncludes.includes(x));
}

export function produceNewRelationship(relationship: Partial<Relationship> & { resourceId: string }) {
    return {
        from: false,
        to: true,
        diff: '+' as const,
        ...relationship,
    };
}
