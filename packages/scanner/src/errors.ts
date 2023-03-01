/* istanbul ignore file */
// TODO: Add tests

export class MissingUrlError extends Error {
    constructor(resourceId: string) {
        super(`Missing URL for resource ${resourceId}`);
    }
}

export class MissingGitHubOptionsError extends Error {
    constructor(resourceId: string) {
        super(`Missing GitHub options for resource ${resourceId}`);
    }
}

export class ScanWorkingDirectoryError extends Error {
    constructor(scanWorkingDirectory: string) {
        super(`Scan working directory is incorrect '${scanWorkingDirectory}'`);
    }
}
