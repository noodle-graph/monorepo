export class MissingUrlError extends Error {
    constructor(resourceId: string) {
        super(`Missing URL for resource ${resourceId}`);
    }
}

export class MissingGitHubOptions extends Error {}
