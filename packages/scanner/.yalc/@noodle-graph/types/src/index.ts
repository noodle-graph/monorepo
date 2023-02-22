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
}

export function foo() {
    console.log('foo');
}
