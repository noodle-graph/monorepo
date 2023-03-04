import type { Logger } from 'pino';

export type Source = 'local' | 'github' | 'config' | 'scan';

export type ScanResult = {
    resources: Resource[];
};

export interface ResourceScanContext {
    context: ScanContext;
    resource: Resource & { source: Source };
}

export interface ScanContext extends ScanOptions {
    config: NoodleConfig & { include: RegExp };
    scanWorkersNum: number;
    logger?: Logger;
}

export interface ScanOptions {
    config: NoodleConfig;
    github?: ScanGithubOptions;
    scanWorkersNum?: number;
    scanWorkingDirectory?: string;
}

interface NoodleConfig {
    resources: Resource[];
    include?: string | RegExp;
}

export interface FilesIteratorSettings {
    readonly resource: Readonly<Resource & { source: Source }>;
    readonly url: string;
    readonly localBaseUrl: string;
    readonly include: RegExp;
    readonly github?: Readonly<FilesIteratorGitHubSettings>;
}

export interface FilesIteratorGitHubSettings extends Readonly<ScanGithubOptions>, Readonly<ResourceGithubOptions> {}

interface ScanGithubOptions {
    token: string;
}

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
}

export interface Relationship {
    resourceId: string;
    action?: string;
    tags: string[];
    url?: string;
    from?: boolean;
    to?: boolean;
}

interface ResourceGithubOptions {
    branch: string;
}
