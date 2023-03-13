import type { ChildProcess } from 'child_process';
import { exec, spawn } from 'child_process';
import { mkdir, mkdtemp, readFile, rm } from 'fs/promises';
import { join } from 'path';

import { fetch } from 'undici';

import { SCAN_OUTPUT_JSON_FILENAME } from '../run';

const expectedResources = [
    {
        id: 'some-resource',
        url: 'https://github.com/noodle-graph/monorepo',
        include: 'scanner/src/__mocks__/data/.*\\.js$',
        source: 'github',
        tags: ['tag1'],
        relationships: expect.arrayContaining([
            {
                resourceId: 'another-resource',
                url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/callingAnotherService.js#L3',
                action: 'calls',
                from: false,
                to: true,
                tags: [],
            },
            {
                resourceId: 'some-db',
                url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/callingDb.js#L3',
                action: undefined,
                from: false,
                to: true,
                tags: ['tag1'],
            },
            {
                resourceId: 'some-sqs-queue',
                url: 'https://github.com/noodle-graph/monorepo/blob/master/packages/scanner/src/__mocks__/data/someResource/inner/folder/callingQueue.js#L3',
                action: undefined,
                from: false,
                to: true,
                tags: [],
            },
        ]),
    },
    {
        id: 'another-resource',
        source: 'scan',
        tags: [],
    },
    {
        id: 'some-db',
        source: 'scan',
        tags: ['tag1'],
    },
    {
        id: 'some-sqs-queue',
        source: 'scan',
        tags: [],
    },
];

const distDirPath = join(__dirname, '../../dist');
const configPath = join(__dirname, '../__mocks__/data/noodle.json');
const tmpDirPath = join(__dirname, 'tmp');

beforeAll(async () => {
    try {
        await mkdir(tmpDirPath);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
});

describe('cli', () => {
    describe('noodle run', () => {
        let tmpTestDirPath: string;
        let processes: ChildProcess[] = [];

        beforeAll(async () => {
            tmpTestDirPath = await mkdtemp(join(tmpDirPath, 'noodle-integration-test-'));
            await new Promise<void>((resolve, reject) =>
                exec(`node ${distDirPath} run --config ${configPath} --output ${tmpTestDirPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                })
            );
        });

        afterEach(async () => {
            for (const process of processes) {
                process.kill();
            }
            await Promise.all(processes.map((process) => new Promise((resolve) => process.on('close', resolve))));
            processes = [];
        });

        afterAll(async () => {
            await rm(tmpTestDirPath, { recursive: true });
        });

        it('has the correct resources', async () => {
            const scanOutputVariable = JSON.parse((await readFile(join(tmpTestDirPath, SCAN_OUTPUT_JSON_FILENAME))).toString());
            expect(scanOutputVariable.resources).toEqual(expect.arrayContaining(expectedResources));
        });

        it('can be served', async () => {
            const child = spawn('node', [distDirPath, 'serve', '--scanOutputDir', tmpTestDirPath, '--production']);
            processes.push(child);

            const address = await new Promise<string>((resolve) =>
                child.stdout.on('data', (data) => {
                    const address = /Server listening at (http:\/\/[\w\d.]+:\d+)/.exec(data.toString())?.[1];
                    if (address) resolve(address);
                })
            );

            expect((await fetch(address)).ok).toBe(true);
        });
    });
});
