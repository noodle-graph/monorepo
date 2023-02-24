import { cpSync, rmSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const UI_BUILD_PATH = 'ui/build';
const DIST_DIR_PATH = join(__dirname, '../dist');
const DIST_UI_BUILD_PATH = join(DIST_DIR_PATH, UI_BUILD_PATH);
const SOURCE_UI_BUILD_PATH = join(__dirname, '../..', UI_BUILD_PATH);

rmSync(DIST_UI_BUILD_PATH, { recursive: true, force: true });
cpSync(SOURCE_UI_BUILD_PATH, DIST_UI_BUILD_PATH, { recursive: true });
