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

Each skill uses YAML frontmatter:

```yaml
---
name: subgraph-dev
description: Expert knowledge for developing subgraphs
metadata:
  openclaw:
    emoji: 📊
    category: blockchain
    tags: [thegraph, subgraph, web3]
    binary: graph
    install:
      npm: "@graphprotocol/graph-cli"
---
```

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
