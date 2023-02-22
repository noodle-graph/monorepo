export interface Relationship {
    resourceId: string;
    action: string;
    tags: string[];
    url: string;
}

export interface Resource {
    id: string;
    name?: string;
    type?: string;
    tags?: string[];
    relationships?: Relationship[];
}
