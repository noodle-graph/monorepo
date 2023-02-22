import figlet from "figlet";
import { Command } from "commander";
import {here} from "./here";
import {scan} from "./scan";
import {bundle} from "./bundle";

export const program = new Command();

console.log(figlet.textSync("Noodle cli"));

program
    .name("noodle")
    .version("1.0.0")
    .description("Noodle CLI for managing a directory");

const hereCommand = new Command('here')
    .description('Runs a scan on the current directory and bundle the UI locally.')
    // .argument('<name>', 'Name of the person to say goodbye to')
    .action(here)
;

const scanCommand = new Command('scan')
    .description('Using the scanner to search resources relationships.')
    // .argument('<name>', 'Name of the person to say goodbye to')
    .action(scan)
;

const bundleCommand = new Command('bundle')
    .description('Creates a UI bundle with the specified scan output.')
    // .argument('<name>', 'Name of the person to say goodbye to')
    .action(bundle)
;

program.addCommand(hereCommand);
program.addCommand(scanCommand);
program.addCommand(bundleCommand);

program.parse(process.argv)
