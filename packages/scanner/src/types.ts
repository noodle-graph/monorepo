import type { NoodleConfig, Resource, ResourceGithubOptions, ScanGithubOptions, ScanOptions, Source } from '@noodle-graph/types';
import type { Logger } from 'pino';

export interface ResourceScanContext {
    context: ScanContext;
    resource: Resource & { source: Source };
}

export interface ScanContext extends ScanOptions {
    config: NoodleConfig & { include: RegExp };
    scanWorkersNum: number;
    logger?: Logger;
}

export interface FilesIteratorSettings {
    readonly resource: Readonly<Resource & { source: Source }>;
    readonly url: string;
    readonly localBaseUrl: string;
    readonly include: RegExp;
    readonly github?: Readonly<FilesIteratorGitHubSettings>;
}

export interface FilesIteratorGitHubSettings extends Readonly<ScanGithubOptions>, Readonly<ResourceGithubOptions> {}
