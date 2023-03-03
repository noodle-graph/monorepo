import { exec } from 'child_process';
import { mkdtemp, readFile } from 'fs/promises';
import { tmpdir } from 'os';
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
                resourceId: 'some-queue',
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
        id: 'some-queue',
        source: 'scan',
        tags: [],
    },
];

it('noodle run', async () => {
    const distDirPath = join(__dirname, '../../dist');
    const configPath = join(__dirname, '../__mocks__/data/noodle.json');
    const tempDirPath = await mkdtemp(join(tmpdir(), 'noodle-integration-test-'));

    const command = `node ${distDirPath} run --config ${configPath} --output ${tempDirPath}`;

    await new Promise<void>((resolve) => exec(command, () => resolve()));
    const rawOutput = (await readFile(join(tempDirPath, 'scanOutput.js'))).toString();
    const rawScanOutputVariable = /window\.scanOutput = ({.*});/.exec(rawOutput)![1];
    const scanOutputVariable = JSON.parse(rawScanOutputVariable);
    expect(scanOutputVariable.resources).toEqual(expect.arrayContaining(expectedResources));
});
