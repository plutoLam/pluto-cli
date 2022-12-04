#!/usr/bin/env node
console.log('执行');
import { Command } from 'commander';
import chalk from 'chalk';

import { readFile } from 'fs/promises';
const pkg = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);

import createModel from '../lib/create.js'

const program = new Command();
program
  .name(pkg.name)
  .usage('<command> [option]')
  .version(pkg.version)

program.on('--help', () => {
  console.log();
  console.log(
    `Run ${chalk.cyan(
      'pluto-cli <command> --help'
    )} for detailed usage of given command.
    `)
});

program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((projectName, options) => {
    // 引入create模块，并传入参数
    createModel(projectName, options);
  })


program.parse();

