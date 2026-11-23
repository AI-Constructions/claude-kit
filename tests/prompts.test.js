import { describe, test, expect } from '@jest/globals';
import { buildPromptConfig, FRAMEWORK_OPTIONS, INTEGRATION_OPTIONS } from '../src/prompts.js';

describe('prompts', () => {
  test('FRAMEWORK_OPTIONS has mobile, web, and backend categories', () => {
    expect(FRAMEWORK_OPTIONS.mobile).toBeDefined();
    expect(FRAMEWORK_OPTIONS.web).toBeDefined();
    expect(FRAMEWORK_OPTIONS.backend).toBeDefined();
    expect(FRAMEWORK_OPTIONS.mobile.length).toBeGreaterThanOrEqual(2);
    expect(FRAMEWORK_OPTIONS.web.length).toBeGreaterThanOrEqual(4);
    expect(FRAMEWORK_OPTIONS.backend.length).toBeGreaterThanOrEqual(4);
  });

  test('INTEGRATION_OPTIONS has cicd, aws, asana, n8n', () => {
    const names = INTEGRATION_OPTIONS.map(i => i.value);
    expect(names).toContain('cicd');
    expect(names).toContain('aws');
    expect(names).toContain('asana');
    expect(names).toContain('n8n');
  });

  test('buildPromptConfig returns array of prompt objects', () => {
    const prompts = buildPromptConfig();
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThanOrEqual(3);

    const names = prompts.map(p => p.name);
    expect(names).toContain('projectName');
    expect(names).toContain('modules');
    expect(names).toContain('integrations');
    expect(names).toContain('plugins');
  });

  test('framework prompts have when conditions based on module selection', () => {
    const prompts = buildPromptConfig();
    const mobileFramework = prompts.find(p => p.name === 'mobileFramework');
    const webFramework = prompts.find(p => p.name === 'webFramework');
    const backendFramework = prompts.find(p => p.name === 'backendFramework');

    expect(typeof mobileFramework.when).toBe('function');
    expect(typeof webFramework.when).toBe('function');
    expect(typeof backendFramework.when).toBe('function');

    expect(mobileFramework.when({ modules: ['mobile'] })).toBe(true);
    expect(mobileFramework.when({ modules: ['web'] })).toBe(false);
    expect(webFramework.when({ modules: ['web'] })).toBe(true);
    expect(webFramework.when({ modules: ['backend'] })).toBe(false);
    expect(backendFramework.when({ modules: ['backend'] })).toBe(true);
    expect(backendFramework.when({ modules: ['mobile'] })).toBe(false);
  });
});

describe('normalizeAnswers', () => {
  test('transforms raw answers into template variables', async () => {
    const { normalizeAnswers } = await import('../src/prompts.js');
    const raw = {
      projectName: 'test-app',
      modules: ['mobile', 'backend'],
      mobileFramework: 'expo-rn-nativewind',
      webFramework: undefined,
      backendFramework: 'fastapi-sqlalchemy',
      integrations: ['cicd', 'aws'],
      plugins: ['superpowers', 'gsd']
    };

    const result = normalizeAnswers(raw);

    expect(result).toEqual({
      projectName: 'test-app',
      modules: { mobile: true, web: false, backend: true },
      mobileFramework: 'expo-rn-nativewind',
      webFramework: null,
      backendFramework: 'fastapi-sqlalchemy',
      integrations: { cicd: true, aws: true, asana: false, n8n: false },
      plugins: { superpowers: true, gsd: true, uiUxProMax: false, watch: false }
    });
  });

  test('handles all modules and integrations selected', async () => {
    const { normalizeAnswers } = await import('../src/prompts.js');
    const raw = {
      projectName: 'full-app',
      modules: ['mobile', 'web', 'backend'],
      mobileFramework: 'flutter',
      webFramework: 'nextjs',
      backendFramework: 'django',
      integrations: ['cicd', 'aws', 'asana', 'n8n'],
      plugins: ['superpowers', 'gsd', 'uiUxProMax']
    };

    const result = normalizeAnswers(raw);
    expect(result.modules).toEqual({ mobile: true, web: true, backend: true });
    expect(result.integrations).toEqual({ cicd: true, aws: true, asana: true, n8n: true });
    expect(result.plugins).toEqual({ superpowers: true, gsd: true, uiUxProMax: true, watch: false });
  });
});
