export { DEFAULT_FILES_WORKERS_NUM } from './scanner';

import type { ScanOptions, ScanResult } from '@noodle-graph/types';
import type { Logger } from 'pino';

import { Scanner } from './scanner';

export function scan(options: ScanOptions, logger?: Logger): Promise<ScanResult> {
    return new Scanner(options, logger).scan();
}
