---
name: subgraph-testing
description: Quality assurance for subgraphs - Matchstick unit testing, Subgraph Linter static analysis, CI/CD
metadata:
  openclaw:
    emoji: 🧪
    category: blockchain
    tags:
      - thegraph
      - testing
      - linting
      - matchstick
    binary: graph
    install:
      npm: "matchstick-as"
---

# Subgraph Testing Skill

Quality assurance for subgraphs using Matchstick framework, Subgraph Linter, and integration testing.

## Overview

Three complementary approaches:
1. **Static Analysis (Subgraph Linter)** - Catches bugs before runtime
2. **Unit Testing (Matchstick)** - Tests mapping logic in isolation
3. **Integration Testing** - Validates end-to-end behavior

---

## Subgraph Linter

Static analysis tool that detects runtime crash patterns before deployment.

### Installation

```bash
# CLI
git clone https://github.com/graphprotocol/subgraph-linter.git
cd subgraph-linter && npm install && npm run build

# VS Code Extension - install from marketplace
```

### Usage

```bash
npm run check -- --manifest ../your-subgraph/subgraph.yaml
```

### Key Checks

| Check | Detects |
|-------|---------|
| `entity-overwrite` | Stale entity saves after helper modifications |
| `unchecked-load` | `Entity.load()!` without null handling |
| `division-guard` | Division with potentially zero denominator |
| `undeclared-eth-call` | Contract calls not in manifest |

### Common Fixes

```typescript
// BAD - unchecked-load
let token = Token.load(address)!

// GOOD - explicit null check
let token = Token.load(address)
if (token == null) {
  token = new Token(address)
}
```

```typescript
// BAD - division-guard
let price = amountOut.div(amountIn)

// GOOD - guard zero
if (amountIn.gt(BigInt.zero())) {
  let price = amountOut.div(amountIn)
}
```

### Suppression

```typescript
// [allow(derived-field-guard)]
entity.save()
```

---

## Matchstick Unit Testing

### Setup

```bash
npm install --save-dev matchstick-as
```

### Basic Test

```typescript
import { describe, test, beforeEach, afterEach, clearStore, assert } from "matchstick-as"
import { handleTransfer } from "../src/mapping"

describe("Transfer Handler", () => {
  afterEach(() => {
    clearStore()
  })

  test("creates Transfer entity", () => {
    let event = createTransferEvent(from, to, value)
    handleTransfer(event)
    assert.entityCount("Transfer", 1)
  })
})
```

### Mock Events

```typescript
import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"

export function createTransferEvent(from: Address, to: Address, value: BigInt): Transfer {
  let event = changetype<Transfer>(newMockEvent())
  event.parameters = new Array()
  event.parameters.push(new ethereum.EventParam("from", ethereum.Value.fromAddress(from)))
  event.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)))
  event.parameters.push(new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value)))
  return event
}
```

### Mock Contract Calls

```typescript
import { createMockedFunction } from "matchstick-as"

createMockedFunction(contractAddress, "name", "name():(string)")
  .returns([ethereum.Value.fromString("Token Name")])

createMockedFunction(contractAddress, "balanceOf", "balanceOf(address):(uint256)")
  .withArgs([ethereum.Value.fromAddress(userAddress)])
  .returns([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1000))])
```

### Assertions

```typescript
assert.entityCount("Token", 1)
assert.fieldEquals("Token", tokenId, "name", "My Token")
assert.notInStore("Token", "nonexistent-id")
```

### Run Tests

```bash
graph test
graph test -c  # with coverage
graph test -d  # in Docker
```

---

## CI/CD Integration

```yaml
name: Subgraph Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run codegen
      - run: npx subgraph-linter --manifest subgraph.yaml
      - run: npm test
      - run: npm run build
```

## Quality Workflow

1. **Write code** with VS Code Subgraph Linter extension
2. **Generate safe helpers** with Subgraph Uncrashable (optional)
3. **Run static analysis** with Subgraph Linter CLI
4. **Write unit tests** with Matchstick
5. **Integration test** with local graph-node
6. **CI pipeline** blocks merges on failures

## References

- [Matchstick Docs](https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/)
- [Subgraph Linter](https://thegraph.com/docs/en/subgraphs/developing/subgraph-linter/)
- [Subgraph Uncrashable](https://thegraph.com/docs/en/subgraphs/developing/subgraph-uncrashable/)
