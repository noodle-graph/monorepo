#! /usr/bin/env node

import { DEFAULT_FILES_WORKERS_NUM } from '@noodle-graph/scanner';
import { Command } from 'commander';
import figlet from 'figlet';

import { run } from './run';

export const program = new Command();

program.name('noodle').version('0.0.5').description(figlet.textSync('Noodle'));

program.addCommand(
    new Command('run')
        .description('Using the scanner to search resources relationships.')
        .option('--config, -c <string>', 'Path to the scan configuration file.', process.env.NOODLE_CONFIG ?? 'noodle.json')
        .option('--output, -o <string>', 'Path the the bundle output directory.', process.env.NOODLE_OUTPUT ?? './noodleScanOutput')
        .option('--githubToken <string>', 'GitHub access token.', process.env.NOODLE_GITHUB_TOKEN)
        .option('--open', 'Whether to open in the browser the bundled UI when finished.')
        .option('--workers', 'Number of scanner workers', DEFAULT_FILES_WORKERS_NUM.toString())
        .option('--verbose', 'Print debug logs')
        .action(run)
);

program.parse();
