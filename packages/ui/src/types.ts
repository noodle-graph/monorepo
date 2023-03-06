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

export interface Tag {
    key: string;
    value: string;
    display: string;
    selected: boolean;
}
