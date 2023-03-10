import { DEFAULT_FILES_WORKERS_NUM } from '@noodle-graph/scanner';
import { Command, Option } from 'commander';
import figlet from 'figlet';

import packageJson from '../package.json';

import { run } from './run';

new Command()
    .name('noodle')
    .version(packageJson.version)
    .description(figlet.textSync('Noodle'))
    .addCommand(
        new Command('run')
            .description('Using the scanner to search resources relationships.')
            .addOption(new Option('--config, -c <string>', 'Path to the scan configuration file.').default('noodle.json').env('NOODLE_CONFIG'))
            .addOption(new Option('--output, -o <string>', 'Path the the bundle output directory.').default('./noodleScanOutput').env('NOODLE_OUTPUT'))
            .addOption(new Option('--githubToken <string>', 'GitHub access token.').env('NOODLE_GITHUB_TOKEN'))
            .addOption(new Option('--open', 'Whether to open in the browser the bundled UI when finished.'))
            .addOption(new Option('--workers <number>', 'Number of scanner workers').default(DEFAULT_FILES_WORKERS_NUM).env('NOODLE_WORKERS').argParser(parseFloat))
            .addOption(new Option('--verbose', 'Print debug logs.'))
            .action(run)
    )
    .parse();
