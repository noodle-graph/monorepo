export class MissingUrlError extends Error {
    public constructor(resourceId: string) {
        super(`Missing URL for resource ${resourceId}`);
    }
}

export class MissingGitHubOptionsError extends Error {
    public constructor(resourceId: string) {
        super(`Missing GitHub options for resource ${resourceId}`);
    }
}
