#! /usr/bin/env node

import { Command } from 'commander';

import { here } from './here';
import { scan } from './scan';
import { printLogo } from './utils';

export const program = new Command();

printLogo();

program.name('noodle').version('1.0.0').description('Noodle-Graph CLI for managing a directory');

const hereCommand = new Command('here')
    .description('Runs a scan on the current directory and bundle the UI locally.')
    // .argument('<name>', 'Name of the person to say goodbye to')
    .action(here);
const scanCommand = new Command('scan')
    .description('Using the scanner to search resources relationships.')
    .option('--config, -c <string>', 'Path to the scan configuration file.', './noodle.json')
    .option('--output, -o <string>', 'Path the the bundle output directory.','./noodleDist')
    .requiredOption('--githubToken <string>', 'GitHub access token.')
    .option('--open <boolen>', 'Whether to open in the browser the bundled UI when finished.','false')
    .action(scan);

program.addCommand(hereCommand);
program.addCommand(scanCommand);

program.parse(process.argv);
