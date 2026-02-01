# OpenClaw Subgraph Skills

OpenClaw-compatible skills for subgraph development with The Graph protocol.

## Skills

| Skill | Description |
|-------|-------------|
| `subgraph-dev` | Schema design, mappings, composition, deployment |
| `subgraph-optimization` | All 6 best practices for performance |
| `subgraph-testing` | Matchstick + Subgraph Linter + CI/CD |

## Installation

### Via ClawHub (when published)

```bash
clawdbot skill install subgraph-dev
clawdbot skill install subgraph-optimization
clawdbot skill install subgraph-testing
```

### Manual

Copy the skill folders to your OpenClaw skills directory:

```bash
cp -r openclaw/subgraph-* ~/.openclaw/skills/
```

## Skill Format

Each skill uses YAML frontmatter matching the official OpenClaw format:

```yaml
---
name: subgraph-dev
description: "Expert knowledge for developing subgraphs with The Graph protocol."
metadata:
  openclaw:
    emoji: 📊
    requires:
      bins: ["graph"]
    install:
      - id: npm
        kind: npm
        package: "@graphprotocol/graph-cli"
        global: true
        bins: ["graph"]
        label: "Install Graph CLI (npm)"
      - id: yarn
        kind: yarn
        package: "@graphprotocol/graph-cli"
        global: true
        bins: ["graph"]
        label: "Install Graph CLI (yarn)"
---
```

### Frontmatter Fields

| Field | Description |
|-------|-------------|
| `name` | Skill identifier |
| `description` | Brief description (quoted) |
| `metadata.openclaw.emoji` | Display emoji |
| `metadata.openclaw.requires.bins` | Required binaries |
| `metadata.openclaw.install` | Installation methods array |
| `install[].id` | Unique installer ID |
| `install[].kind` | Installer type (npm, yarn, brew, apt) |
| `install[].package` | Package name |
| `install[].bins` | Binaries provided |
| `install[].label` | UI display label |

## Differences from Claude Code Plugin

| Feature | Claude Code | OpenClaw |
|---------|-------------|----------|
| Manifest | `.claude-plugin/manifest.json` | YAML frontmatter in SKILL.md |
| References | `references/` subfolder | Inline or separate files |
| Registry | N/A | ClawHub |
| Install | `claude plugins add` | `clawdbot skill install` |

## See Also

- [Main README](../README.md) - Full documentation
- [Claude Code Plugin](../skills/) - Claude Code format
- [ClawHub](https://github.com/openclaw/clawhub) - OpenClaw skill registry
