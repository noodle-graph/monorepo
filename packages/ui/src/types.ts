export interface Relationship {
    resourceId: string;
    action: string;
    tags: string[];
    url: string;
    resource?: Omit<Resource, 'relationships'>;
    from?: boolean;
    to?: boolean;
}

export interface Resource {
    id: string;
    name?: string;
    type?: string;
    tags?: string[];
    url?: string;
    relationships?: Relationship[];
    description?: string;
    source: string;
}
