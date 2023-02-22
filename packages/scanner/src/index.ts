import types = require('@noodle-graph/types');

import { persist, relationships } from './noodle-utils';

const fs = require('fs');

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

export function scan_config(configPath, outputPath, token) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return scan(config, outputPath, token);
}

export function scan(scan_config: types.ScanConfig, outputPath, token) {
    const resources = scan_config.resources.filter((resource) => resource.source === 'github');
    const promises = resources.map(async (resource) => {
        const { url, id, name, type } = resource;
        let branch = 'HEAD';
        const parts = url.split('#');
        const baseURL = parts[0];
        branch = parts[1];
        const tree = await git.getTree({
            dir: '.',
            ref: branch,
            depth: 1,
            http,
            baseURL,
            token: token,
        });

        const comments = await Promise.all(
            tree.map(async (entry) => {
                if (entry.type === 'blob') {
                    const content = await git.readBlob({
                        dir: '.',
                        oid: entry.oid,
                        http,
                        url,
                        token: token,
                    });
                    const results = relationships(entry.path, content);
                    return { id: id, name: name, repo: url, type: type, path: entry.path, relationships: results };
                }
            })
        );

        comments.forEach((comment) => {
            if (comment) {
                console.log('Bla');
            }
        });

        return comments;
    });

    Promise.all(promises)
        .then((comments) => {
            persist(comments, outputPath);
        })
        .catch((err) => {
            console.error(`Error: ${err.message}`);
            throw err;
        });
}

module.exports = scan;
