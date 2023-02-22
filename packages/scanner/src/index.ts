import types, { Relationship } from '@noodle-graph/types';

import { persist, relationships } from './noodle-utils';

const fs = require('fs');
const os = require('os');
const path = require('path');

// const glob = require('fast-glob');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

export function foo() {
    console.log('foo');
}
export function scan_config(configPath, outputPath, token) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return scan(config, outputPath, token);
}

export function scan(scan_config: types.ScanConfig, outputPath, token) {
    const resources = scan_config.resources.filter((resource) => resource.source === 'github');
    const promises = resources.map(async (resource) => {
        const { url, id, name, type } = resource;
        console.log(`Handling resource, ${url} ${id} ${name} ${type}`);
        let branch = 'HEAD';
        const parts = url.split('#');
        const baseURL = parts[0];
        branch = parts[1];

        // Make temporary directory
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-'));
        console.log(dir);

        // await git.clone({
        //     fs,
        //     http,
        //     dir,
        //     url: baseURL,
        //     ref: branch,
        //     singleBranch: true,
        //     depth: 10,
        //     token: token,
        // });

        // Clone the repository
        await git.clone({
            fs: fs,
            dir: dir,
            url: baseURL,
            ref: branch,
            http: http,
            singleBranch: true,
            onAuth: () => ({ username: token, password: '' }),
        });

        let files = await git.listFiles({
            fs: fs,
            dir: dir,
            ref: branch,
        });

        // files = await glob('**/*.{js,jsx,ts,tsx,java}', { cwd: dir, files });
        files = files.filter((file) => file.endsWith('ts') || file.endsWith('java')); //DOR fix with an amazing regex filter
        const results: Relationship[] = [];
        for (const file of files) {
            console.log(`${file}`);
            const fileData = fs.readFileSync(path.join(dir, file), 'utf8');
            // console.log(`${fileData}`);
            results.push(...relationships(url, fileData));
        }

        const outputResource: types.Resource = {
            id: resource.id,
            name: resource.name,
            type: resource.type,
            tags: resource.tags,
            relationships: results,
        };

        return outputResource;
    });

    Promise.all(promises)
        .then((outputResource) => {
            persist(outputResource, outputPath);
        })
        .catch((err) => {
            console.error(`Error: ${err.message}`);
            throw err;
        });
}

module.exports = scan;
// const resourceList: types.Resource[] = [
//     {
//         id: 'test_id',
//         type: 'test_type',
//         name: 'test_name',
//         tags: ['tag1', 'tag2'],
//         relationships: [{ resourceId: 'test_resourceId', action: 'test_action', url: 'https://test.url/test', tags: ['tag3', 'tag4'] }],
//     },
// ];
// writeToJSONFile(resourceList);

const test_resource1: types.ConfigResource = {
    id: 'sm',
    name: 'scan manager',
    description: '',
    source: 'github',
    type: 'ecs',
    url: 'https://github.office.opendns.com/OOB-DLP/scan-manager#hackathon',
    tags: new Array<string>(),
};

const test_resource2: types.ConfigResource = {
    id: 'ae',
    name: 'analytics engine',
    description: '',
    source: 'github',
    type: 'ecs',
    url: 'https://github.office.opendns.com/OOB-DLP/dar-core-analysis-engine#hackathon',
    tags: new Array<string>(),
};

const resources = new Array<types.ConfigResource>();
resources.push(test_resource1);
resources.push(test_resource2);

const test_config: types.ScanConfig = {
    resources: resources,
};

scan(test_config, undefined, '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');
