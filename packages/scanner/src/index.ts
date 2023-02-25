export { DEFAULT_FILES_WORKERS_NUM } from './scanner';

import { Logger } from 'pino';

import { Scanner, ScanOptions } from './scanner';
import { ScanResult } from './types';

export function scan(options: ScanOptions, logger: Logger): Promise<ScanResult> {
    return new Scanner(options, logger).scan();
}
