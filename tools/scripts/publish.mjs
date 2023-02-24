// TODO: Write documentation

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';

import { readCachedProjectGraph } from '@nrwl/devkit';
import chalk from 'chalk';

const VERSION_PATTERN = /^\d+\.\d+\.\d+(-\w+\.\d+)?/;
const DEFAULT_ENVIRONMENT = 'local';
const ENVIRONMENTS = {
    production: {
        registry: 'https://registry.npmjs.org',
        defaultVersion: null,
        defaultTag: (version) => (version.includes('-') ? 'next' : 'latest'),
        overwrite: false,
    },
    local: {
        registry: 'http://localhost:4873',
        defaultVersion: '0.0.0-local.1',
        defaultTag: (_version) => 'local',
        overwrite: true,
    },
};

function invariant(condition, message) {
    if (!condition) {
        console.error(chalk.bold.red(message));
        throw new Error(message);
    }
}

function getArgOrDefault(value, defaultValue) {
    return !value || value === 'undefined' ? defaultValue : value;
}

const [, , name, versionArg, envArg, tagArg] = process.argv;

const environment = ENVIRONMENTS[getArgOrDefault(envArg, DEFAULT_ENVIRONMENT)];
invariant(environment, `Environment is not supported, got ${envArg}.`);

const version = getArgOrDefault(versionArg, environment.defaultVersion);
invariant(version && VERSION_PATTERN.test(version), `No version provided or version did not match Semantic Versioning, expected: #.#.#-tag.# or #.#.#, got ${version}.`);

const tag = getArgOrDefault(tagArg, environment.defaultTag(version));
const graph = readCachedProjectGraph();
const project = graph.nodes[name];

invariant(project, `Could not find project "${name}" in the workspace. Is the project.json configured correctly?`);

const outputPath = project.data.root + '/dist';
invariant(outputPath, `Could not find package folder of "${name}". Is project.json configured correctly?`);

process.chdir(outputPath);

let packageName;

// Updating the version in "package.json" before publishing
try {
    const json = JSON.parse(readFileSync('package.json').toString());
    packageName = json.name;
    json.version = version;
    writeFileSync('package.json', JSON.stringify(json, null, 4));
} catch (e) {
    console.error(chalk.bold.red('Error reading package.json file from library build output.'));
    exit(1);
}

if (environment.overwrite) {
    try {
        execSync(`npm unpublish --force ${packageName}@${version} --registry ${environment.registry}`);
    } catch (e) {
        console.warn('Could not unpublish');
    }
}
execSync(`npm publish --tag ${tag} --registry ${environment.registry} --access=public`);
