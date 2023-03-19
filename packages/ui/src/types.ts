import type { Relationship, Resource, ScanResult } from '@noodle-graph/types';

export type Diff = '+' | '-';

export interface ResourceExtended extends Resource {
    relationships?: RelationshipExtended[];
    diff?: Diff;
}

export interface RelationshipExtended extends Relationship {
    resource?: Resource;
    diff?: Diff;
}

export interface ScanResultExtended extends ScanResult {
    resources: ResourceExtended[];
}

export interface SelectOption<T> {
    key: string;
    value: T;
    display: string;
}

export interface FilterOption<T> extends SelectOption<T> {
    selected: boolean;
}
