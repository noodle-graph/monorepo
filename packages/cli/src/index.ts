#! /usr/bin/env node

import { Command } from 'commander';

import { scan } from './scan';
import { printLogo } from './utils';

export const program = new Command();

printLogo();

program.name('noodle').version('1.0.0').description('Noodle-Graph CLI for managing a directory');

const scanCommand = new Command('scan')
    .description('Using the scanner to search resources relationships.')
    .option('--config, -c <string>', 'Path to the scan configuration file.', './noodle.json')
    .option('--output, -o <string>', 'Path the the bundle output directory.', './noodleDist')
    .requiredOption('--githubToken <string>', 'GitHub access token.')
    .option('--open <boolen>', 'Whether to open in the browser the bundled UI when finished.', 'false')
    .action(scan);

program.addCommand(scanCommand);

program.parse(process.argv);
