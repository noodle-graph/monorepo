#! /usr/bin/env node
/* eslint-disable node/shebang */

import { DEFAULT_FILES_WORKERS_NUM } from '@noodle-graph/scanner';
import { Command, Option } from 'commander';
import figlet from 'figlet';

import packageJson from '../package.json';

import { run } from './run';
import { serve } from './serve';

const DEFAULT_SCAN_OUTPUT = './noodleScanOutput';

new Command()
    .name('noodle')
    .version(packageJson.version)
    .description(figlet.textSync('Noodle'))
    .addCommand(
        new Command('run')
            .description('Using the scanner to search resources relationships.')
            .addOption(new Option('-c, --config <string>', 'Path to the scan configuration file.').default('noodle.json').env('NOODLE_CONFIG'))
            .addOption(new Option('-o, --output <string>', 'Path the the bundle output directory.').default(DEFAULT_SCAN_OUTPUT).env('NOODLE_OUTPUT'))
            .addOption(new Option('--githubToken <string>', 'GitHub access token.').env('NOODLE_GITHUB_TOKEN'))
            .addOption(new Option('--open', 'Whether to open in the browser the bundled UI when finished.'))
            .addOption(new Option('--workers <number>', 'Number of scanner workers').default(DEFAULT_FILES_WORKERS_NUM).env('NOODLE_WORKERS').argParser(parseFloat))
            .addOption(new Option('--verbose', 'Print debug logs.'))
            .action(run)
    )
    .addCommand(
        new Command('serve')
            .description('Serves scan output')
            .addOption(new Option('--production', 'Run with default production options'))
            .addOption(new Option('-p, --port <number>', 'Port to listen on').default(0).env('NOODLE_PORT').argParser(parseFloat))
            .addOption(new Option('-h, --host <string>', 'Host to listen on').default('127.0.0.1').env('NOODLE_HOST'))
            .addOption(new Option('--scanOutputDir <string>', 'The directory of the scan output files').default(DEFAULT_SCAN_OUTPUT).env('NOODLE_OUTPUT'))
            .action(serve)
    )
    .parse();
