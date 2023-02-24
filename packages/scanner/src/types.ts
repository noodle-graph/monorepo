// TODO: Move to common types

export type Source = 'local' | 'github' | 'config';

export interface ScanConfig {
    resources: Resource[];
}

export type ScanResult = ScanConfig; // Expected be different in the future

export interface Resource {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    tags?: string[];
    url?: string;
    source: Source;
    relationships?: Relationship[];
    github: {
        ref: string;
    };
}

export interface Relationship {
    resourceId: string;
    action?: string;
    tags?: string[];
    url?: string;
    from?: boolean;
    to?: boolean;
}
