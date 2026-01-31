---
name: subgraph-optimization
description: Best practices for optimizing subgraph performance, indexing speed, and query responsiveness
metadata:
  openclaw:
    emoji: ⚡
    category: blockchain
    tags:
      - thegraph
      - performance
      - optimization
      - indexing
    binary: graph
    install:
      npm: "@graphprotocol/graph-cli"
---

# Subgraph Optimization Skill

Expert knowledge for optimizing subgraph performance, indexing speed, and query responsiveness. Covers The Graph's official best practices.

## Overview

Six key optimization areas:
1. Pruning with indexerHints
2. Arrays with @derivedFrom
3. Immutable Entities and Bytes as IDs
4. Avoiding eth_calls
5. Timeseries and Aggregations
6. Grafting for Hotfixes

## 1. Pruning with indexerHints

Remove outdated entities to improve query performance:

```yaml
specVersion: 1.3.0
indexerHints:
  prune: auto
```

| Option | Description |
|--------|-------------|
| `prune: auto` | Retains minimum necessary history (default) |
| `prune: <number>` | Keeps specific number of blocks |
| `prune: never` | Retains entire history (for Time Travel Queries) |

## 2. Arrays with @derivedFrom

Avoid storing large arrays directly:

```graphql
# BAD - arrays slow down as they grow
type Pool @entity {
  swaps: [Swap!]!
}

# GOOD - use @derivedFrom
type Pool @entity {
  swaps: [Swap!]! @derivedFrom(field: "pool")
}

type Swap @entity {
  id: Bytes!
  pool: Pool!
}
```

## 3. Immutable Entities and Bytes as IDs

Combined improvement: ~28% faster queries, ~48% faster indexing.

### Immutable Entities

```graphql
type Transfer @entity(immutable: true) {
  id: Bytes!
  from: Bytes!
  to: Bytes!
  value: BigInt!
}
```

### Bytes as IDs

```typescript
// BAD - String concatenation
let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()

// GOOD - Bytes concatenation
let id = event.transaction.hash.concatI32(event.logIndex.toI32())
```

## 4. Avoiding eth_calls

eth_calls significantly slow indexing. Solutions:

**Preferred: Emit data in events**
```solidity
// Contract emits all needed data
event Swap(address pool, address tokenIn, uint256 amountIn, uint256 reserve0);
```

**If unavoidable: Declare in manifest (specVersion 1.2.0+)**
```yaml
eventHandlers:
  - event: Transfer(indexed address,indexed address,uint256)
    handler: handleTransfer
    calls:
      name: ERC20[event.address].name()
      symbol: ERC20[event.address].symbol()
```

**Cache contract data:**
```typescript
let token = Token.load(address)
if (token == null) {
  token = new Token(address)
  let contract = ERC20.bind(address)
  token.name = contract.name()  // Only called once
  token.save()
}
```

## 5. Timeseries and Aggregations

Offload aggregations to database (specVersion 1.1.0+):

```graphql
type TokenHourData @entity(timeseries: true) {
  id: Int8!
  timestamp: Timestamp!
  token: Token!
  priceUSD: BigDecimal!
  volumeUSD: BigDecimal!
}

type TokenDayData @aggregation(
  intervals: ["hour", "day"],
  source: "TokenHourData"
) {
  id: Int8!
  timestamp: Timestamp!
  token: Token!
  avgPrice: BigDecimal! @aggregate(fn: "avg", arg: "priceUSD")
  totalVolume: BigDecimal! @aggregate(fn: "sum", arg: "volumeUSD")
}
```

Functions: `sum`, `count`, `min`, `max`, `first`, `last`, `avg`

## 6. Grafting for Hotfixes

Deploy fixes without re-indexing from genesis:

```yaml
features:
  - grafting
graft:
  base: QmExistingSubgraphDeploymentId
  block: 18000000
```

Cannot graft from pruned blocks.

## Performance Checklist

- [ ] `indexerHints.prune: auto` enabled
- [ ] No large arrays (use @derivedFrom)
- [ ] Event-derived entities marked immutable
- [ ] Using Bytes for IDs
- [ ] Minimized eth_calls
- [ ] Timeseries for time-based aggregations

## References

- [Pruning](https://thegraph.com/docs/en/subgraphs/best-practices/pruning/)
- [@derivedFrom](https://thegraph.com/docs/en/subgraphs/best-practices/derivedfrom/)
- [Immutable Entities](https://thegraph.com/docs/en/subgraphs/best-practices/immutable-entities-bytes-as-ids/)
- [Avoiding eth_calls](https://thegraph.com/docs/en/subgraphs/best-practices/avoid-eth-calls/)
