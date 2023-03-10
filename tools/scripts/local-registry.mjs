import { spawn } from 'child_process';
import { rmSync } from 'fs';
import { exit } from 'process';

import chalk from 'chalk';

const { bold, green, magenta, italic, red, underline } = chalk;

const [, , subCommand = 'help', project] = process.argv;

function consoleHelp(command, info) {
    console.log(`${green(command)} -- ${info}`);
}

function help() {
    consoleHelp('npm run local-registry help', `Show ${bold`help`}`);
    consoleHelp('npm run local-registry start', `${bold`Start`} the local registry`);
    consoleHelp('npm run local-registry login', `${bold`Login`} to the local registry (needed once)`);
    consoleHelp('npm run local-registry publish <project name>', `${bold`Publish`} locally`);
    consoleHelp('npm run local-registry clear', `${bold`Clear`} storage`);
    consoleHelp('npm install <package name>@local --registry=http://localhost:4873', `${bold`Install`} from the local registry`);
    console.log(bold.blue`\nSee more in the ${underline`CONTRIBUTING.md`}\n`);
}

function start() {
    console.log(italic.bold`${magenta`First time?`} Don't forget to login! 👈`);
    console.log(green`npm run local-registry login`);
    console.log();
    spawn('npx', ['verdaccio', '--config', './.verdaccio/config.yml'], { stdio: 'inherit' });
}

function login() {
    console.log(italic`Username and password: ${bold.magenta`test`} 👈\n`);
    spawn('npm', ['login', '--registry', 'http://localhost:4873', '--auth-type', 'legacy'], { stdio: 'inherit' });
}

function clear() {
    rmSync('.verdaccio/storage', { force: true, recursive: true });
}

function publish() {
    spawn('npx', ['nx', 'publish', project], { stdio: 'inherit' });
}

const commandFunc = { help, start, login, clear, publish }[subCommand];

if (!commandFunc) {
    help();
    console.error(red`\n'${subCommand}' is not supported`);
    exit(1);
}

commandFunc();
