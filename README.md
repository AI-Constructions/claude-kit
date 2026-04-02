# @aiconstructions/claude-kit

Interactive CLI to scaffold a multi-agent Claude Code workspace for your project.

## Quick Start

```bash
npx @aiconstructions/claude-kit
```

## What You Get

A fully configured Claude Code workspace with:

- **CLAUDE.md** — Master orchestration guide adapted to your stack
- **12 specialist agents** — manager, planner, backend, frontend, qa, security, analyzer, git, offline, cicd, asana, n8n (included based on your selections)
- **Shared context files** — API spec, infrastructure state, test reports
- **Plugin auto-install** — Superpowers, GSD, ui-ux-pro-max

## Supported Stacks

### Mobile
- Expo + React Native + NativeWind
- Flutter

### Web
- React + Vite + Tailwind CSS
- Next.js
- Nuxt.js
- Svelte

### Backend
- Python + FastAPI + SQLAlchemy
- Python + Django
- Node.js + Express
- Node.js + NestJS

### Integrations
- GitHub Actions (CI/CD)
- AWS (EC2, RDS, S3, CloudFront)
- Asana
- n8n

## Prerequisites

- Node.js >= 18
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (for Superpowers plugin install)

## Options

```bash
npx @aiconstructions/claude-kit [directory] [options]

Options:
  --no-plugins    Skip plugin installation
  -V, --version   Output version number
  -h, --help      Display help
```

## Plugins Installed

| Plugin | Source | Method |
|--------|--------|--------|
| [Superpowers](https://github.com/obra/superpowers) | Claude Plugin Marketplace | `claude plugin install` |
| [GSD](https://github.com/gsd-build/get-shit-done) | npm | `npx get-shit-done-cc` |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | GitHub | Direct download |

## License

MIT
