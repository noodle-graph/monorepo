import { simpleGit } from 'simple-git';

interface GitCloneOptions {
    repoUrl: string;
    localUrl: string;
    branch: string;
    token: string;
}

export class GitClient {
    private readonly git = simpleGit();

    public async clone(options: GitCloneOptions): Promise<void> {
        const repoUrl = new URL(options.repoUrl);
        repoUrl.username = options.token;

        await this.git.clone(repoUrl.toString(), options.localUrl, {
            '--depth': 1,
            '--single-branch': null,
            '--branch': options.branch,
        });
    }
}
