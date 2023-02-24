import { execSync } from 'child_process';

import { Tree, generateFiles, joinPathFragments, installPackagesTask } from '@nrwl/devkit';

export default async function (tree: Tree, schema: any) {
    const cwd = `packages/${schema.name}`;
    generateFiles(
        tree, // the virtual file system
        joinPathFragments(__dirname, './files'), // path to the file templates
        cwd, // destination path of the files
        schema // config object to replace variable in file templates
    );
    return () => {
        installPackagesTask(tree, true, cwd);
        execSync(`npx nx build ${schema.name}`);
        installPackagesTask(tree, true);
    };
}
