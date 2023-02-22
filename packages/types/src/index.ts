export interface ScanConfig {
    resources: ConfigResource[];
}

export interface ConfigResource {
    id: string;
    name: string;
    description: string;
    type: string; //"aws/ecs",
    tags: string[];
    url: string;
    source: string; //github
}

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

export function foo() {
    console.log('foo');
}
