# Subgraph Examples

Working examples demonstrating common subgraph patterns.

## Available Examples

### erc20-token

A complete ERC20 token tracker that demonstrates:
- Token metadata fetching with `try_` methods
- Transfer event handling
- Balance tracking with holder count
- Composite Bytes IDs
- Immutable entities for transfers

**Files:**
- `schema.graphql` - Entity definitions
- `subgraph.yaml` - Manifest configuration
- `src/mapping.ts` - Event handlers

**Usage:**
```bash
cd examples/erc20-token
graph codegen
graph build
```

## Example Patterns Demonstrated

| Pattern | Example |
|---------|---------|
| Get or create entity | `getOrCreateToken()` |
| Safe contract calls | `contract.try_name()` |
| Composite IDs | `tokenAddress.concat(holder)` |
| Immutable events | `@entity(immutable: true)` |
| Derived relationships | `@derivedFrom(field: "token")` |
| Balance tracking | `updateBalance()` with delta |
| Holder counting | Increment/decrement on balance change |

## Adding Your Own Examples

1. Create a new directory under `examples/`
2. Include: `schema.graphql`, `subgraph.yaml`, `src/mapping.ts`
3. Add ABI files if needed in `abis/`
4. Update this README

## See Also

- [patterns.md](../skills/subgraph-dev/references/patterns.md) - More schema patterns
- [common-errors.md](../skills/subgraph-testing/references/common-errors.md) - Troubleshooting
