import { execSync } from 'child_process';
import path from 'path';

export function getInstallCommands(targetDir, plugins) {
  const commands = [];

  if (plugins.superpowers) {
    commands.push({
      name: 'Superpowers',
      type: 'exec',
      command: 'claude plugin install superpowers@claude-plugins-official'
    });
  }

  if (plugins.gsd) {
    commands.push({
      name: 'GSD',
      type: 'exec',
      command: 'npx get-shit-done-cc@latest --claude --local'
    });
  }

  if (plugins.uiUxProMax) {
    commands.push({
      name: 'ui-ux-pro-max (marketplace)',
      type: 'exec',
      command: 'claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill'
    });
    commands.push({
      name: 'ui-ux-pro-max (install)',
      type: 'exec',
      command: 'claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill'
    });
  }

  if (plugins.watch) {
    commands.push({
      name: 'claude-video /watch (marketplace)',
      type: 'exec',
      command: 'claude plugin marketplace add bradautomates/claude-video'
    });
    commands.push({
      name: 'claude-video /watch (install)',
      type: 'exec',
      command: 'claude plugin install watch@claude-video'
    });
  }

  return commands;
}

export function checkPrerequisites() {
  const results = { node: false, claude: false };

  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const major = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
    results.node = major >= 18;
  } catch {
    results.node = false;
  }

  try {
    execSync('claude --version', { encoding: 'utf8', stdio: 'pipe' });
    results.claude = true;
  } catch {
    results.claude = false;
  }

  return results;
}

export async function installPlugins(targetDir, plugins, { onStart, onDone, onError } = {}) {
  const commands = getInstallCommands(targetDir, plugins);
  const results = [];

  for (const cmd of commands) {
    onStart?.(cmd.name);

    try {
      if (cmd.type === 'exec') {
        execSync(cmd.command, {
          cwd: targetDir,
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 120_000
        });
      } else if (cmd.type === 'giget') {
        const { downloadTemplate } = await import('giget');
        await downloadTemplate(cmd.source, { dir: cmd.dest, force: true });
      }

      onDone?.(cmd.name);
      results.push({ name: cmd.name, success: true });
    } catch (err) {
      onError?.(cmd.name, err.message);
      results.push({ name: cmd.name, success: false, error: err.message });
    }
  }

  return results;
}
