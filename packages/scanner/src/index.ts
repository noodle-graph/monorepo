export { DEFAULT_FILES_WORKERS_NUM } from './scanner';

import type { Logger } from 'pino';

import { Scanner } from './scanner';
import type { ScanOptions, ScanResult } from './types';

export function scan(options: ScanOptions, logger?: Logger): Promise<ScanResult> {
    return new Scanner(options, logger).scan();
}
