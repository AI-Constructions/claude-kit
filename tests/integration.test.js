// tests/integration.test.js
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { generate } from '../src/generator.js';
import { normalizeAnswers } from '../src/prompts.js';

describe('integration: full scaffold', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-kit-integ-'));
  });

  afterEach(async () => {
    await fs.remove(tmpDir);
  });

  test('full-stack Expo + FastAPI + React scaffold', async () => {
    const vars = normalizeAnswers({
      projectName: 'full-stack-app',
      modules: ['mobile', 'web', 'backend'],
      mobileFramework: 'expo-rn-nativewind',
      webFramework: 'react-vite-tailwind',
      backendFramework: 'fastapi-sqlalchemy',
      integrations: ['cicd', 'aws', 'asana', 'n8n'],
      plugins: ['superpowers', 'gsd', 'uiUxProMax']
    });

    await generate(tmpDir, vars);

    // CLAUDE.md exists and has project name
    const claude = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf8');
    expect(claude).toContain('full-stack-app');
    expect(claude).toContain('backend');
    expect(claude).toContain('frontend');
    expect(claude).toContain('manager');

    // All 12 agents present
    const agents = await fs.readdir(path.join(tmpDir, '.claude', 'agents'));
    expect(agents.sort()).toEqual([
      'analyzer.md', 'asana.md', 'backend.md', 'cicd.md',
      'frontend.md', 'git.md', 'manager.md', 'n8n.md',
      'offline.md', 'planner.md', 'qa.md', 'security.md'
    ]);

    // Context files
    const context = await fs.readdir(path.join(tmpDir, '.claude', 'context'));
    expect(context.sort()).toEqual([
      'AGENT_CONTEXT.md', 'api-spec.md', 'infra-state.md', 'test-report.md'
    ]);

    // Agent context has stack info
    const agentCtx = await fs.readFile(
      path.join(tmpDir, '.claude', 'context', 'AGENT_CONTEXT.md'), 'utf8'
    );
    expect(agentCtx).toContain('full-stack-app');
  });

  test('backend-only Django scaffold', async () => {
    const vars = normalizeAnswers({
      projectName: 'api-only',
      modules: ['backend'],
      mobileFramework: undefined,
      webFramework: undefined,
      backendFramework: 'django',
      integrations: ['cicd'],
      plugins: []
    });

    await generate(tmpDir, vars);

    const agents = await fs.readdir(path.join(tmpDir, '.claude', 'agents'));

    // Core + backend + cicd, no frontend/offline/asana/n8n
    expect(agents).toContain('backend.md');
    expect(agents).toContain('cicd.md');
    expect(agents).not.toContain('frontend.md');
    expect(agents).not.toContain('offline.md');
    expect(agents).not.toContain('asana.md');
    expect(agents).not.toContain('n8n.md');

    // Backend agent mentions Django
    const backend = await fs.readFile(
      path.join(tmpDir, '.claude', 'agents', 'backend.md'), 'utf8'
    );
    expect(backend).toContain('Django');
  });

  test('Flutter + NestJS scaffold', async () => {
    const vars = normalizeAnswers({
      projectName: 'flutter-app',
      modules: ['mobile', 'backend'],
      mobileFramework: 'flutter',
      webFramework: undefined,
      backendFramework: 'nestjs',
      integrations: [],
      plugins: []
    });

    await generate(tmpDir, vars);

    const agents = await fs.readdir(path.join(tmpDir, '.claude', 'agents'));
    expect(agents).toContain('frontend.md');
    expect(agents).toContain('offline.md');
    expect(agents).toContain('backend.md');
    expect(agents).not.toContain('cicd.md');

    const frontend = await fs.readFile(
      path.join(tmpDir, '.claude', 'agents', 'frontend.md'), 'utf8'
    );
    expect(frontend).toContain('Flutter');

    const backend = await fs.readFile(
      path.join(tmpDir, '.claude', 'agents', 'backend.md'), 'utf8'
    );
    expect(backend).toContain('NestJS');
  });

  test('web-only Next.js scaffold', async () => {
    const vars = normalizeAnswers({
      projectName: 'web-only',
      modules: ['web'],
      mobileFramework: undefined,
      webFramework: 'nextjs',
      backendFramework: undefined,
      integrations: [],
      plugins: []
    });

    await generate(tmpDir, vars);

    const agents = await fs.readdir(path.join(tmpDir, '.claude', 'agents'));
    expect(agents).toContain('frontend.md');
    expect(agents).not.toContain('backend.md');
    expect(agents).not.toContain('offline.md');

    const frontend = await fs.readFile(
      path.join(tmpDir, '.claude', 'agents', 'frontend.md'), 'utf8'
    );
    expect(frontend).toContain('Next.js');
  });
});
