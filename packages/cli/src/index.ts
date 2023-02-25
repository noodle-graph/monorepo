#! /usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';

import { run } from './run';

export const program = new Command();

console.log(figlet.textSync('Noodle'));

program.name('noodle').version('1.0.0').description('Noodle CLI');

program.addCommand(
    new Command('run')
        .description('Using the scanner to search resources relationships.')
        .option('--config, -c <string>', 'Path to the scan configuration file.', process.env.NOODLE_CONFIG ?? 'noodle.json')
        .option('--output, -o <string>', 'Path the the bundle output directory.', process.env.NOODLE_OUTPUT ?? './noodleScanOutput')
        .option('--githubToken <string>', 'GitHub access token.', process.env.NOODLE_GITHUB_TOKEN)
        .option('--open', 'Whether to open in the browser the bundled UI when finished.')
        .option('--workers', 'Number of scanner workers')
        .option('--verbose', 'Print debug logs')
        .action(run)
);

program.parse();
