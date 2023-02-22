export interface ScanConfig {
    resources: Resource[];
}

export interface Resource {
    id: string;
    name?: string;
    description?: string;
    type?: string; //"aws/ecs",
    tags?: string[];
    url: string;
    source?: string; //github
    relationships?: Relationship[];
}

export interface Relationship {
    resourceId: string;
    action: string;
    tags?: string[];
    url: string; // repo+filename#3
    direction: Direction;
}

export function foo() {
    console.log('foo');
}

export enum Direction {
    None = 'none',
    To = 'to',
    From = 'from',
    Both = 'both',
}
