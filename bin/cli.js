#!/usr/bin/env node

import { program } from 'commander';
import { run } from '../src/index.js';

program
  .name('claude-kit')
  .description('Scaffold a multi-agent Claude Code workspace')
  .version('1.0.0')
  .argument('[directory]', 'target directory (defaults to current)')
  .option('--no-plugins', 'skip plugin installation')
  .action(async (directory, options) => {
    try {
      await run({ directory, skipPlugins: !options.plugins });
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  });

program.parse();
