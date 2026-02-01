---
name: subgraph-dev
description: "Expert knowledge for developing subgraphs with The Graph protocol. Covers schema design, AssemblyScript mappings, manifest configuration, and deployment workflows."
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

# Subgraph Development Skill

Expert knowledge for developing subgraphs with The Graph protocol. This skill covers schema design, mapping handlers, data sources, and deployment workflows.

## Overview

Subgraphs are open APIs that extract data from blockchain networks, process it, and store it for efficient querying via GraphQL. They consist of three main components:

1. **Schema (schema.graphql)** - Defines the data structure
2. **Manifest (subgraph.yaml)** - Configures data sources and handlers
3. **Mappings (src/*.ts)** - AssemblyScript handlers that process events

## CLI Commands

```bash
# Install graph-cli globally
npm install -g @graphprotocol/graph-cli

# Initialize new subgraph
graph init --product subgraph-studio

# Generate types from schema and ABIs
graph codegen

# Build the subgraph
graph build

# Authenticate with Subgraph Studio
graph auth --studio <DEPLOY_KEY>

# Deploy to Subgraph Studio
graph deploy --studio <SUBGRAPH_SLUG>
```

## Schema Design

### Entity Definition

```graphql
type Token @entity {
  id: Bytes!                          # Unique identifier
  name: String!                       # Token name
  symbol: String!                     # Token symbol
  decimals: Int!                      # Decimal places
  totalSupply: BigInt!                # Total supply
  holders: [TokenBalance!]! @derivedFrom(field: "token")
}

type TokenBalance @entity {
  id: Bytes!                          # address + token address
  token: Token!                       # Reference to token
  account: Bytes!                     # Holder address
  amount: BigInt!                     # Balance amount
}
```

### Field Types

| Type | Description | Example |
|------|-------------|---------|
| `Bytes` | Byte array (addresses, hashes) | `id: Bytes!` |
| `String` | UTF-8 string | `name: String!` |
| `Int` | 32-bit integer | `decimals: Int!` |
| `BigInt` | Arbitrary precision integer | `totalSupply: BigInt!` |
| `BigDecimal` | Arbitrary precision decimal | `price: BigDecimal!` |
| `Boolean` | True/false | `active: Boolean!` |

### Relationships with @derivedFrom

```graphql
type Pool @entity {
  id: Bytes!
  swaps: [Swap!]! @derivedFrom(field: "pool")
}

type Swap @entity {
  id: Bytes!
  pool: Pool!
}
```

## Manifest Configuration (subgraph.yaml)

```yaml
specVersion: 1.3.0
schema:
  file: ./schema.graphql
indexerHints:
  prune: auto
dataSources:
  - kind: ethereum/contract
    name: ERC20
    network: mainnet
    source:
      address: "0x..."
      abi: ERC20
      startBlock: 12345678
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - Token
        - Transfer
      abis:
        - name: ERC20
          file: ./abis/ERC20.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/mapping.ts
```

## Mapping Handlers

```typescript
import { Transfer } from "../generated/ERC20/ERC20"
import { Token, TransferEvent } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  // Load or create token entity
  let token = Token.load(event.address)
  if (token == null) {
    token = new Token(event.address)
    token.name = "Unknown"
    token.symbol = "???"
    token.decimals = 18
    token.totalSupply = BigInt.zero()
  }
  token.save()

  // Create transfer event entity (use Bytes ID)
  let transfer = new TransferEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  transfer.token = token.id
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.amount = event.params.value
  transfer.timestamp = event.block.timestamp
  transfer.save()
}
```

## Data Source Templates

For dynamically created contracts (factory patterns):

```yaml
templates:
  - kind: ethereum/contract
    name: Pool
    network: mainnet
    source:
      abi: Pool
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - Pool
      eventHandlers:
        - event: Swap(indexed address,uint256,uint256)
          handler: handleSwap
      file: ./src/pool.ts
```

```typescript
import { Pool as PoolTemplate } from "../generated/templates"

export function handlePoolCreated(event: PoolCreated): void {
  PoolTemplate.create(event.params.pool)
}
```

## Subgraph Composition

Combine multiple subgraphs into one:

```yaml
dataSources:
  - kind: subgraph
    name: TokenSource
    network: mainnet
    source:
      address: "QmSourceSubgraphId..."
      startBlock: 18000000
    mapping:
      kind: subgraph/triggers
      apiVersion: 0.0.9
      language: wasm/assemblyscript
      entities:
        - AggregatedData
      triggers:
        - entity: Token
          handler: handleToken
      file: ./src/composition.ts
```

Requirements: specVersion 1.3.0+, immutable entities, max 5 sources, same chain.

## Networks

Supported: mainnet, arbitrum-one, optimism, polygon, base, avalanche, bsc, gnosis, fantom, celo, and more.

## References

- [The Graph Documentation](https://thegraph.com/docs/)
- [AssemblyScript API](https://thegraph.com/docs/en/subgraphs/developing/creating/assemblyscript-api/)
- [Subgraph Composition](https://thegraph.com/docs/en/subgraphs/guides/subgraph-composition/)
