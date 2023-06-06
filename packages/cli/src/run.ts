import { readFile, cp, writeFile, mkdir } from 'fs/promises';
import { join, isAbsolute } from 'path';

import { scan } from '@noodle-graph/scanner';

import { serve } from './serve';
import { createLogger } from './utils';

const UI_BUILD_DIR_PATH = '../ui/build';
export const SCAN_OUTPUT_JSON_FILENAME = 'scanOutput.json';

interface Attributes {
    verbose?: true;
    config: string;
    output: string;
    githubToken?: string;
    workers: number;
    open?: true;
}

export async function run(attributes: Attributes): Promise<void> {
    const logger = createLogger({ level: attributes.verbose ? 'debug' : 'info' });

    const configPath = isAbsolute(attributes.config) ? attributes.config : join(process.cwd(), attributes.config);
    const outputDirPath = isAbsolute(attributes.output) ? attributes.output : join(process.cwd(), attributes.output);
    const scanOutputJsonPath = join(outputDirPath, SCAN_OUTPUT_JSON_FILENAME);

    logger.debug({ ...attributes, configPath, outputDirPath, scanOutputJsonPath }, 'Running command `run`');

    const scanResult = await scan(
        {
            config: JSON.parse((await readFile(configPath)).toString()),
            github: attributes.githubToken ? { token: attributes.githubToken } : undefined,
            scanWorkersNum: attributes.workers,
        },
        logger
    );

    await mkdir(outputDirPath, { recursive: true });
    await cp(join(__dirname, UI_BUILD_DIR_PATH), outputDirPath, { recursive: true });

    await writeFile(scanOutputJsonPath, JSON.stringify(scanResult), { encoding: 'utf8' });

    if (attributes.open) serve({ scanOutputDir: outputDirPath, host: '127.0.0.1', port: 0, logger });
}
