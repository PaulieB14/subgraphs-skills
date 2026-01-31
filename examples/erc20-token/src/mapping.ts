// ERC20 Token Tracker - Example Mapping
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from "../generated/ERC20/ERC20"
import { ERC20 } from "../generated/ERC20/ERC20"
import { Token, TokenBalance, Transfer } from "../generated/schema"

// Constants
const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)

export function handleTransfer(event: TransferEvent): void {
  // Get or create token
  let token = getOrCreateToken(event.address)

  // Update transfer count
  token.transferCount = token.transferCount.plus(ONE)
  token.save()

  // Update sender balance (if not mint)
  if (event.params.from != Address.zero()) {
    updateBalance(
      event.address,
      event.params.from,
      event.params.value.neg(),
      event.block.timestamp,
      token
    )
  }

  // Update recipient balance (if not burn)
  if (event.params.to != Address.zero()) {
    updateBalance(
      event.address,
      event.params.to,
      event.params.value,
      event.block.timestamp,
      token
    )
  }

  // Create immutable transfer record
  let transfer = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  transfer.token = token.id
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.amount = event.params.value
  transfer.timestamp = event.block.timestamp
  transfer.blockNumber = event.block.number
  transfer.transactionHash = event.transaction.hash
  transfer.save()
}

function getOrCreateToken(address: Bytes): Token {
  let token = Token.load(address)

  if (token == null) {
    token = new Token(address)
    let contract = ERC20.bind(Address.fromBytes(address))

    // Use try_ methods to handle potential reverts
    let nameResult = contract.try_name()
    token.name = nameResult.reverted ? "Unknown" : nameResult.value

    let symbolResult = contract.try_symbol()
    token.symbol = symbolResult.reverted ? "???" : symbolResult.value

    let decimalsResult = contract.try_decimals()
    token.decimals = decimalsResult.reverted ? 18 : decimalsResult.value

    let supplyResult = contract.try_totalSupply()
    token.totalSupply = supplyResult.reverted ? ZERO : supplyResult.value

    token.holderCount = ZERO
    token.transferCount = ZERO
    token.save()
  }

  return token
}

function updateBalance(
  tokenAddress: Bytes,
  holder: Bytes,
  delta: BigInt,
  timestamp: BigInt,
  token: Token
): void {
  // Create composite ID: token + holder
  let id = tokenAddress.concat(holder)
  let balance = TokenBalance.load(id)

  if (balance == null) {
    // New holder
    balance = new TokenBalance(id)
    balance.token = tokenAddress
    balance.holder = holder
    balance.amount = ZERO

    // Increment holder count
    token.holderCount = token.holderCount.plus(ONE)
    token.save()
  }

  // Update balance
  let newAmount = balance.amount.plus(delta)

  // Check if holder is exiting (balance going to zero)
  if (newAmount.equals(ZERO) && balance.amount.gt(ZERO)) {
    token.holderCount = token.holderCount.minus(ONE)
    token.save()
  }

  balance.amount = newAmount
  balance.lastUpdated = timestamp
  balance.save()
}
