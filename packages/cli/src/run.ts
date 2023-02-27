import { exec } from 'child_process';
import { readFile, cp, writeFile, mkdir } from 'fs/promises';
import { join, isAbsolute } from 'path';

import { scan } from '@noodle-graph/scanner';
import loggerConstructor from 'pino';

const UI_BUILD_DIR_PATH = 'ui/build';
const SCAN_OUTPUT_JS_FILENAME = 'scanOutput.js';
const SCAN_OUTPUT_JS_PLACEHOLDER = "'%SCAN_OUTPUT_PLACEHOLDER%'";
const INDEX_HTML_FILENAME = 'index.html';

export async function run(scanAttributes): Promise<void> {
    const logger = createLogger(scanAttributes.verbose ? 'debug' : 'info');

    logger.debug(scanAttributes, 'Running command `run`');

    const scanWorkingDirectory = process.cwd();
    const configPath = isAbsolute(scanAttributes.C) ? scanAttributes.C : join(scanWorkingDirectory, scanAttributes.C);
    const outputDirPath = isAbsolute(scanAttributes.O) ? scanAttributes.O : join(scanWorkingDirectory, scanAttributes.O);
    const uiDirPath = join(outputDirPath, UI_BUILD_DIR_PATH);
    const uiIndexPath = join(uiDirPath, INDEX_HTML_FILENAME);
    const scanOutputJsPath = join(uiDirPath, SCAN_OUTPUT_JS_FILENAME);

    const scanResult = await scan(
        {
            config: JSON.parse((await readFile(configPath)).toString()),
            github: { token: scanAttributes.githubToken },
            scanWorkersNum: Number(scanAttributes.workers),
            scanWorkingDirectory,
        },
        logger
    );

    await mkdir(uiDirPath, { recursive: true });
    await cp(join(__dirname, UI_BUILD_DIR_PATH), uiDirPath, { recursive: true });

    const scanOutputUiTemplate = (await readFile(scanOutputJsPath)).toString();
    const scanOutputUi = scanOutputUiTemplate.replace(SCAN_OUTPUT_JS_PLACEHOLDER, JSON.stringify(scanResult));
    await writeFile(scanOutputJsPath, scanOutputUi, { encoding: 'utf8' });

    if (scanAttributes.open === true) {
        exec(`open ${uiIndexPath}`);
    }
}

function createLogger(level: 'debug' | 'info') {
    return loggerConstructor({
        level,
        transport: {
            target: 'pino-pretty',
        },
    });
}
