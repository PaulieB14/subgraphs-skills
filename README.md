# Subgraphs Skills

A collection of AI agent skills providing expert knowledge for developing, testing, and deploying subgraphs with [The Graph](https://thegraph.com/) protocol.

## Overview

This repository provides subgraph development expertise for AI coding assistants in **two formats**:

| Format | Location | Use With |
|--------|----------|----------|
| **Claude Code Plugin** | `skills/` | Claude Code CLI |
| **OpenClaw Skills** | `openclaw/` | OpenClaw / Clawdbot |

Same knowledge, different agent platforms.

## Skills

### 🛠️ subgraph-dev
Core development knowledge including:
- Schema design and GraphQL types
- Manifest configuration (subgraph.yaml)
- AssemblyScript mapping handlers
- Data source templates
- Contract bindings and calls
- **Subgraph Composition** - Combine multiple subgraphs
- Subgraph Uncrashable (safe code generation)
- Deployment workflows

### ⚡ subgraph-optimization
Performance best practices from The Graph docs:
- Pruning with indexerHints
- Arrays with @derivedFrom
- Immutable entities and Bytes as IDs
- Avoiding eth_calls
- Timeseries and aggregations
- Grafting for hotfixes

### 🧪 subgraph-testing
Quality assurance with Matchstick and Subgraph Linter:
- **Subgraph Linter** - Static analysis to catch bugs before runtime
- Unit testing setup and patterns with Matchstick
- Mock events and contract calls
- Entity assertions
- Data source mocking
- CI/CD integration

## Installation

### Claude Code

```bash
# Add as a Claude Code plugin
claude plugins add PaulieB14/subgraphs-skills
```

### OpenClaw / Clawdbot

```bash
# Copy skills to OpenClaw directory
cp -r openclaw/subgraph-* ~/.openclaw/skills/

# Or via ClawHub (when published)
clawdbot skill install subgraph-dev
clawdbot skill install subgraph-optimization
clawdbot skill install subgraph-testing
```

### Manual

Clone this repository and reference it in your agent's configuration.

## Repository Structure

```
subgraphs-skills/
├── .claude-plugin/
│   └── manifest.json           # Claude Code plugin metadata
├── skills/                     # Claude Code format
│   ├── subgraph-dev/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── schema-types.md
│   │       ├── assemblyscript-api.md
│   │       ├── subgraph-composition.md
│   │       └── subgraph-uncrashable.md
│   ├── subgraph-optimization/
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── performance-benchmarks.md
│   └── subgraph-testing/
│       ├── SKILL.md
│       └── references/
│           ├── matchstick-api.md
│           └── subgraph-linter.md
├── openclaw/                   # OpenClaw format (YAML frontmatter)
│   ├── README.md
│   ├── subgraph-dev/
│   │   └── SKILL.md
│   ├── subgraph-optimization/
│   │   └── SKILL.md
│   └── subgraph-testing/
│       └── SKILL.md
├── examples/
├── scripts/
├── package.json
└── README.md
```

## Usage Examples

Once installed, the AI assistant will have access to subgraph development expertise:

**Schema Design:**
> "Create a schema for tracking DEX swaps with proper relationships"

**Optimization:**
> "How do I optimize my subgraph for faster indexing?"

**Testing:**
> "Write unit tests for my Transfer event handler"

## Resources

- [The Graph Documentation](https://thegraph.com/docs/)
- [Subgraph Best Practices](https://thegraph.com/docs/en/subgraphs/best-practices/pruning/)
- [Subgraph Composition](https://thegraph.com/docs/en/subgraphs/guides/subgraph-composition/) - Combine multiple subgraphs
- [Subgraph Linter](https://thegraph.com/docs/en/subgraphs/developing/subgraph-linter/) - Static analysis tool
- [Subgraph Uncrashable](https://thegraph.com/docs/en/subgraphs/developing/subgraph-uncrashable/) - Safe code generation
- [Matchstick Testing Framework](https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/)
- [AssemblyScript API](https://thegraph.com/docs/en/subgraphs/developing/creating/assemblyscript-api/)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
