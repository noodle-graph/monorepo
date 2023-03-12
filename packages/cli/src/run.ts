import { readFile, cp, writeFile, mkdir } from 'fs/promises';
import { join, isAbsolute } from 'path';

import { scan } from '@noodle-graph/scanner';

import { serve } from './serve';
import { createLogger } from './utils';

const UI_BUILD_DIR_PATH = '../ui/build';
const SCAN_OUTPUT_JS_FILENAME = 'scanOutput.js';
const SCAN_OUTPUT_JS_PLACEHOLDER = "'%SCAN_OUTPUT_PLACEHOLDER%'";

export async function run(attributes): Promise<void> {
    const logger = createLogger(attributes.verbose ? 'debug' : 'info');

    logger.debug(attributes, 'Running command `run`');

    const configPath = isAbsolute(attributes.C) ? attributes.C : join(process.cwd(), attributes.C);
    const outputDirPath = isAbsolute(attributes.O) ? attributes.O : join(process.cwd(), attributes.O);
    const scanOutputJsPath = join(outputDirPath, SCAN_OUTPUT_JS_FILENAME);

    const scanResult = await scan(
        {
            config: JSON.parse((await readFile(configPath)).toString()),
            github: { token: attributes.githubToken },
            scanWorkersNum: attributes.workers,
        },
        logger
    );

    await mkdir(outputDirPath, { recursive: true });
    await cp(join(__dirname, UI_BUILD_DIR_PATH), outputDirPath, { recursive: true });

    const scanOutputUiTemplate = (await readFile(scanOutputJsPath)).toString();
    const scanOutputUi = scanOutputUiTemplate.replace(SCAN_OUTPUT_JS_PLACEHOLDER, JSON.stringify(scanResult));
    await writeFile(scanOutputJsPath, scanOutputUi, { encoding: 'utf8' });

    if (attributes.open) serve({ scanOutputDir: outputDirPath, open: true, host: '127.0.0.1' });
}
