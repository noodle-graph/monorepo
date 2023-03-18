export class ResourceAlreadyExistError extends Error {
    public constructor() {
        super('Resource already exists');
    }
}
