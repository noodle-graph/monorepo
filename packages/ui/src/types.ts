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

export interface Selection<T> {
    key: string;
    value: T;
    display: string;
}

export interface SelectionMultiple<T> extends Selection<T> {
    selected: boolean;
}
