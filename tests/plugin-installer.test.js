import { describe, test, expect } from '@jest/globals';
import { getInstallCommands } from '../src/plugin-installer.js';

describe('plugin-installer', () => {
  test('getInstallCommands returns correct commands for each plugin', () => {
    const targetDir = '/tmp/my-app';
    const plugins = { superpowers: true, gsd: true, uiUxProMax: true };

    const commands = getInstallCommands(targetDir, plugins);

    expect(commands).toHaveLength(4);
    expect(commands[0]).toEqual({
      name: 'Superpowers',
      type: 'exec',
      command: 'claude plugin install superpowers@claude-plugins-official'
    });
    expect(commands[1]).toEqual({
      name: 'GSD',
      type: 'exec',
      command: 'npx get-shit-done-cc@latest --claude --local'
    });
    expect(commands[2]).toEqual({
      name: 'ui-ux-pro-max (marketplace)',
      type: 'exec',
      command: 'claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill'
    });
    expect(commands[3]).toEqual({
      name: 'ui-ux-pro-max (install)',
      type: 'exec',
      command: 'claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill'
    });
  });

  test('getInstallCommands filters by plugin selection', () => {
    const commands = getInstallCommands('/tmp/x', {
      superpowers: false,
      gsd: true,
      uiUxProMax: false,
      watch: false
    });

    expect(commands).toHaveLength(1);
    expect(commands[0].name).toBe('GSD');
  });

  test('getInstallCommands returns empty for no plugins', () => {
    const commands = getInstallCommands('/tmp/x', {
      superpowers: false,
      gsd: false,
      uiUxProMax: false
    });

    expect(commands).toHaveLength(0);
  });

  test('getInstallCommands adds claude-video /watch commands', () => {
    const commands = getInstallCommands('/tmp/x', { watch: true });

    expect(commands).toEqual([
      { name: 'claude-video /watch (marketplace)', type: 'exec', command: 'claude plugin marketplace add bradautomates/claude-video' },
      { name: 'claude-video /watch (install)', type: 'exec', command: 'claude plugin install watch@claude-video' }
    ]);
  });
});
