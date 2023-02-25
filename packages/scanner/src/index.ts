import { Logger } from 'pino';

import { Scanner, ScanOptions } from './scanner';
import { ScanResult } from './types';

export function scan(options: ScanOptions, logger: Logger): Promise<ScanResult> {
    return new Scanner(options, logger).scan();
}
