import { GitClient } from '../../gitClient';

interface GitCloneOptions {
    repoUrl: string;
    localUrl: string;
    branch: string;
    token: string;
}

export class GitClientMock extends GitClient {
    override clone(_options: GitCloneOptions): Promise<void> {
        return Promise.resolve();
    }
}
