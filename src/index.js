// src/index.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { buildPromptConfig, normalizeAnswers } from './prompts.js';
import { generate } from './generator.js';
import { installPlugins, checkPrerequisites } from './plugin-installer.js';

function printBanner() {
  console.log('');
  console.log(chalk.bold.cyan('  AIC Claude Kit'));
  console.log(chalk.dim('  Multi-Agent Setup CLI'));
  console.log('');
}

export async function run({ directory, skipPlugins = false } = {}) {
  printBanner();

  // Interactive prompts
  const prompts = buildPromptConfig();
  const rawAnswers = await inquirer.prompt(prompts);
  const vars = normalizeAnswers(rawAnswers);

  // Resolve target directory
  const targetDir = path.resolve(directory || vars.projectName);

  // Check if directory exists and has .claude
  if (await fs.pathExists(path.join(targetDir, '.claude'))) {
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: `${targetDir} already has a .claude/ directory. Overwrite?`,
      default: false
    }]);
    if (!overwrite) {
      console.log(chalk.yellow('Aborted.'));
      return;
    }
  }

  // Scaffold
  const scaffoldSpinner = ora('Scaffolding project...').start();
  try {
    await generate(targetDir, vars);
    scaffoldSpinner.succeed('Project scaffolded');
  } catch (err) {
    scaffoldSpinner.fail('Scaffolding failed');
    throw err;
  }

  // Plugin installation
  if (!skipPlugins) {
    const prereqs = checkPrerequisites();

    if (!prereqs.claude && vars.plugins.superpowers) {
      console.log(chalk.yellow('  Warning: claude CLI not found in PATH — Superpowers will be skipped'));
      vars.plugins.superpowers = false;
    }

    let activeSpinner = null;

    await installPlugins(targetDir, vars.plugins, {
      onStart: (name) => {
        activeSpinner = ora(`Installing ${name}...`).start();
      },
      onDone: (name) => {
        if (activeSpinner) {
          activeSpinner.succeed(`${name} installed`);
          activeSpinner = null;
        }
      },
      onError: (name, error) => {
        if (activeSpinner) {
          activeSpinner.warn(`${name} failed: ${error}`);
          activeSpinner = null;
        }
      }
    });
  }

  // Done
  console.log('');
  console.log(chalk.green.bold('Your project is ready!'));

  const relPath = path.relative(process.cwd(), targetDir);
  if (relPath && relPath !== '.') {
    console.log(chalk.dim(`  cd ${relPath} && claude`));
  } else {
    console.log(chalk.dim('  claude'));
  }
  console.log('');
}
