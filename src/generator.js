// src/generator.js
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const AGENT_RULES = {
  'manager.md.ejs':  () => true,
  'planner.md.ejs':  () => true,
  'analyzer.md.ejs': () => true,
  'qa.md.ejs':       () => true,
  'security.md.ejs': () => true,
  'git.md.ejs':      () => true,
  'backend.md.ejs':  (vars) => vars.modules.backend,
  'frontend.md.ejs': (vars) => vars.modules.mobile || vars.modules.web,
  'offline.md.ejs':  (vars) => vars.modules.mobile,
  'cicd.md.ejs':     (vars) => vars.integrations.cicd,
  'asana.md.ejs':    (vars) => vars.integrations.asana,
  'n8n.md.ejs':      (vars) => vars.integrations.n8n,
};

async function renderTemplate(templatePath, vars) {
  const template = await fs.readFile(templatePath, 'utf8');
  return ejs.render(template, vars, { filename: templatePath });
}

async function copyStatic(src, dest) {
  await fs.ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

export async function generate(targetDir, vars) {
  await fs.ensureDir(targetDir);

  // 1. Render CLAUDE.md
  const claudeContent = await renderTemplate(
    path.join(TEMPLATES_DIR, 'base', 'CLAUDE.md.ejs'),
    vars
  );
  await fs.writeFile(path.join(targetDir, 'CLAUDE.md'), claudeContent);

  // 2. Render AGENT_CONTEXT.md
  const contextDir = path.join(targetDir, '.claude', 'context');
  await fs.ensureDir(contextDir);

  const agentCtxContent = await renderTemplate(
    path.join(TEMPLATES_DIR, 'base', '.claude', 'context', 'AGENT_CONTEXT.md.ejs'),
    vars
  );
  await fs.writeFile(path.join(contextDir, 'AGENT_CONTEXT.md'), agentCtxContent);

  // 3. Copy static context files
  const staticContextFiles = ['api-spec.md', 'infra-state.md', 'test-report.md'];
  for (const file of staticContextFiles) {
    await copyStatic(
      path.join(TEMPLATES_DIR, 'base', '.claude', 'context', file),
      path.join(contextDir, file)
    );
  }

  // 4. Render agent templates based on inclusion rules
  const agentsDir = path.join(targetDir, '.claude', 'agents');
  await fs.ensureDir(agentsDir);

  for (const [templateFile, shouldInclude] of Object.entries(AGENT_RULES)) {
    if (shouldInclude(vars)) {
      const content = await renderTemplate(
        path.join(TEMPLATES_DIR, 'agents', templateFile),
        vars
      );
      const outputName = templateFile.replace('.ejs', '');
      await fs.writeFile(path.join(agentsDir, outputName), content);
    }
  }

  // 5. Copy bundled skills (always included)
  const skillsSrc = path.join(TEMPLATES_DIR, 'skills');
  if (await fs.pathExists(skillsSrc)) {
    await fs.copy(skillsSrc, path.join(targetDir, '.claude', 'skills'), { overwrite: true });
  }
}

// Export for testing
export { AGENT_RULES };
