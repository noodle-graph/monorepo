import { Scanner, ScanOptions } from './scanner';
import { ScanResult } from './types';

export function scan(options: ScanOptions): Promise<ScanResult> {
    return new Scanner(options).scan();
}
