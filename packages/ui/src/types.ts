import type { Relationship, Resource, ScanResult } from '@noodle-graph/types';

export interface ResourceExtended extends Resource {
    relationships: RelationshipExtended[];
}

export interface RelationshipExtended extends Relationship {
    resource: Resource;
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
