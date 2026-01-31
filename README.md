# Subgraphs Skills

A collection of AI agent skills providing expert knowledge for developing, testing, and deploying subgraphs with [The Graph](https://thegraph.com/) protocol.

## Overview

This repository is a Claude Code Plugin that equips AI assistants with specialized knowledge about subgraph development. It covers schema design, mapping handlers, performance optimization, and testing strategies.

## Skills

### 🛠️ subgraph-dev
Core development knowledge including:
- Schema design and GraphQL types
- Manifest configuration (subgraph.yaml)
- AssemblyScript mapping handlers
- Data source templates
- Contract bindings and calls
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
Testing strategies with Matchstick:
- Unit testing setup and patterns
- Mock events and contract calls
- Entity assertions
- Data source mocking
- CI/CD integration

## Installation

### Claude Code

```bash
# Add as a Claude Code plugin
claude plugins add buildlin/subgraphs-skills
```

### Manual

Clone this repository and reference it in your Claude Code configuration.

## Repository Structure

```
subgraphs-skills/
├── .claude-plugin/
│   └── manifest.json         # Plugin metadata
├── skills/
│   ├── subgraph-dev/
│   │   ├── SKILL.md          # Development expertise
│   │   └── references/
│   │       ├── schema-types.md
│   │       └── assemblyscript-api.md
│   ├── subgraph-optimization/
│   │   ├── SKILL.md          # Optimization best practices
│   │   └── references/
│   │       └── performance-benchmarks.md
│   └── subgraph-testing/
│       ├── SKILL.md          # Testing patterns
│       └── references/
│           └── matchstick-api.md
├── examples/                  # Usage examples
├── scripts/                   # Utility scripts
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
- [Matchstick Testing Framework](https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/)
- [AssemblyScript API](https://thegraph.com/docs/en/subgraphs/developing/creating/assemblyscript-api/)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT
