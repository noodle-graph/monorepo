import { exec } from 'child_process';
import { mkdir, mkdtemp, readFile, rm } from 'fs/promises';
import { join } from 'path';

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
    let tmpTestDirPath: string;

    beforeEach(async () => {
        tmpTestDirPath = await mkdtemp(join(tmpDirPath, 'noodle-integration-test-'));
    });

    afterEach(async () => {
        await rm(tmpTestDirPath, { recursive: true });
    });

    it('noodle run', async () => {
        await new Promise<void>((resolve, reject) =>
            exec(`node ${distDirPath} run --config ${configPath} --output ${tmpTestDirPath}`, (err) => {
                if (err) reject(err);
                else resolve();
            })
        );

        const rawOutput = (await readFile(join(tmpTestDirPath, 'scanOutput.js'))).toString();
        const rawScanOutputVariable = /window\.scanOutput = ({.*});/.exec(rawOutput)![1];
        const scanOutputVariable = JSON.parse(rawScanOutputVariable);
        expect(scanOutputVariable.resources).toEqual(expect.arrayContaining(expectedResources));
    });
});
