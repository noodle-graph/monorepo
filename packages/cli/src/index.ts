#! /usr/bin/env node

import { Command } from 'commander';

import { bundle } from './bundle';
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
    .option('--output, -o <string>', 'Path of the output file.', './noodleScanOutput.json')
    .requiredOption('--githubToken <string>', 'GitHub access token.')
    // .argument('[config]', 'Path to the scan configuration file.','./noodle.json')
    // .argument('[output]', 'Path of the output file.','./noodleScanOutput.json')
    // .argument('<githubToken>', 'GitHub access token.')
    .action(scan);
const bundleCommand = new Command('bundle')
    .description('Creates a UI bundle with the specified scan output.')
    // .argument('<name>', 'Name of the person to say goodbye to')
    .action(bundle);
program.addCommand(hereCommand);
program.addCommand(scanCommand);
program.addCommand(bundleCommand);

program.parse(process.argv);
