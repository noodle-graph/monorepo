export interface NoodlePlugin {
    enrich(resources: Resource[]): void;
}

export interface ScanOptions {
    config: NoodleConfig;
    github?: ScanGithubOptions;
    scanWorkersNum?: number;
    scanWorkingDirectory?: string;
}

export interface NoodleConfig {
    resources: Resource[];
    include?: string | RegExp;
    plugins?: string[];
}

export interface ScanGithubOptions {
    token: string;
}

export type ScanResult = {
    resources: Resource[];
};

export interface Resource {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    tags?: string[];
    url?: string;
    source?: Source;
    relationships?: Relationship[];
    github?: ResourceGithubOptions;
    include?: string | RegExp;
    additionalLinks?: {
        label: string;
        url: string;
    }[];
}

export interface Relationship {
    resourceId: string;
    action?: string;
    tags?: string[];
    url?: string;
    from?: boolean;
    to?: boolean;
}

export interface ResourceGithubOptions {
    branch: string;
}

export type Source = 'local' | 'github' | 'config' | 'scan' | 'ui';
