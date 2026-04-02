import { describe, test, expect } from '@jest/globals';
import { getInstallCommands } from '../src/plugin-installer.js';

describe('plugin-installer', () => {
  test('getInstallCommands returns correct commands for each plugin', () => {
    const targetDir = '/tmp/my-app';
    const plugins = { superpowers: true, gsd: true, uiUxProMax: true };

    const commands = getInstallCommands(targetDir, plugins);

    expect(commands).toHaveLength(3);
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
      name: 'ui-ux-pro-max',
      type: 'giget',
      source: 'github:nextlevelbuilder/ui-ux-pro-max-skill',
      dest: expect.stringMatching(/\.claude[/\\]skills[/\\]ui-ux-pro-max$/)
    });
  });

  test('getInstallCommands filters by plugin selection', () => {
    const commands = getInstallCommands('/tmp/x', {
      superpowers: false,
      gsd: true,
      uiUxProMax: false
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
});
