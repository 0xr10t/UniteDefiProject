# Simple Escrow System

A simplified escrow system for atomic swaps, inspired by 1inch's cross-chain swap contracts. This system provides a secure way to perform atomic swaps with time-based security mechanisms.

## Features

- **Deterministic Addresses**: Escrow contracts are deployed at deterministic addresses using CREATE2
- **Time-based Security**: Withdrawal and cancellation windows with configurable timelocks
- **Emergency Rescue**: Ability to rescue funds in emergency situations
- **Limit Order Integration**: Simple limit order protocol for order management
- **Atomic Swaps**: Secure token swaps with hashlock-based unlocking

## Architecture

### Core Contracts

1. **BaseEscrow**: Abstract base contract providing core escrow functionality
2. **Escrow**: Main escrow implementation with deterministic address validation
3. **EscrowFactory**: Factory contract for creating escrow contracts
4. **SimpleLimitOrderProtocol**: Limit order protocol with escrow integration

### Key Components

- **EscrowData**: Structure containing all escrow parameters
- **Hashlock**: Cryptographic mechanism for secure fund unlocking
- **Timelocks**: Time-based security for withdrawal and cancellation
- **Safety Deposit**: ETH deposit for gas fees and security

## Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- Node.js 16+ (for dependencies)

## Setup

1. Clone the repository
2. Install Foundry dependencies:
   ```bash
   forge install OpenZeppelin/openzeppelin-contracts
   ```
3. Build the contracts:
   ```bash
   forge build
   ```

## Usage

### 1. Deploy Contracts

```bash
# Set your private key
export PRIVATE_KEY=your_private_key_here

# Deploy to local network
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Deploy to testnet
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### 2. Create an Order

```solidity
SimpleLimitOrderProtocol.Order memory order = SimpleLimitOrderProtocol.Order({
    salt: keccak256("salt"),
    makerAsset: token1Address,
    takerAsset: token2Address,
    maker: makerAddress,
    receiver: makerAddress,
    allowedSender: address(0),
    makingAmount: 100e18,
    takingAmount: 50e18,
    offsets: 0,
    interactions: "",
    hashlock: hashlock,
    withdrawalStart: block.timestamp + 3600,
    cancellationStart: block.timestamp + 7200,
    safetyDeposit: 1e18
});
```

### 3. Fill Order and Create Escrow

```solidity
// Approve tokens
token1.approve(address(limitOrderProtocol), 100e18);
token2.approve(address(limitOrderProtocol), 50e18);

// Sign order
bytes32 orderHash = limitOrderProtocol.hashOrder(order);
(uint8 v, bytes32 r, bytes32 s) = vm.sign(maker, orderHash);
bytes memory signature = abi.encodePacked(r, s, v);

// Fill order
limitOrderProtocol.fillOrder(order, signature, 100e18, 50e18);
```

### 4. Withdraw from Escrow

```solidity
// Get escrow address
IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
    orderHash: orderHash,
    hashlock: hashlock,
    maker: maker,
    taker: taker,
    token: address(token1),
    amount: 100e18,
    safetyDeposit: 1e18,
    deployedAt: 0,
    withdrawalStart: order.withdrawalStart,
    cancellationStart: order.cancellationStart
});

address escrowAddress = escrowFactory.addressOfEscrow(escrowData);
IEscrow escrow = IEscrow(escrowAddress);

// Withdraw using secret
escrow.withdraw(secret, escrowData);
```

### 5. Cancel Escrow

```solidity
// Cancel escrow after cancellation time
escrow.cancel(escrowData);
```

## Testing

Run the test suite:

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test test_WithdrawFromEscrow

# Run with verbose output
forge test -vvv

# Run with gas reporting
forge test --gas-report
```

## Development

### Prerequisites
- [Foundry](https://getfoundry.sh/)
- Node.js 16+ (for dependencies)

### Setup
1. Clone the repository
2. Install Foundry dependencies: `forge install OpenZeppelin/openzeppelin-contracts`
3. Build contracts: `forge build`
4. Run tests: `forge test`

### Deployment
1. Set environment variables:
   ```bash
   export PRIVATE_KEY=your_private_key
   export MAINNET_RPC_URL=your_mainnet_rpc_url
   export SEPOLIA_RPC_URL=your_sepolia_rpc_url
   export ETHERSCAN_API_KEY=your_etherscan_api_key
   ```
2. Deploy: `forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify`

## Security Features

### Time-based Security
- **Withdrawal Window**: Funds can only be withdrawn during a specific time window
- **Cancellation Window**: Funds can be cancelled and returned to maker after a certain time
- **Rescue Delay**: Emergency fund recovery with configurable delay

### Cryptographic Security
- **Hashlock**: Funds are locked with a cryptographic hash
- **Secret**: Funds are unlocked by revealing the preimage of the hashlock
- **Deterministic Addresses**: Escrow addresses are computed deterministically

### Access Control
- **Taker-only Withdrawal**: Only the taker can withdraw funds
- **Taker-only Cancellation**: Only the taker can cancel the escrow
- **Emergency Rescue**: Taker can rescue funds in emergency situations

## Contract Structure

```
src/
├── interfaces/
│   ├── IEscrow.sol
│   └── IEscrowFactory.sol
├── libraries/
│   └── EscrowLib.sol
├── BaseEscrow.sol
├── Escrow.sol
├── EscrowFactory.sol
├── SimpleLimitOrderProtocol.sol
└── test/
    └── MockERC20.sol
```

## License

MIT License - see LICENSE file for details.

## Security

This is a simplified implementation for educational purposes. For production use, consider:

- Additional security audits
- More comprehensive testing
- Integration with established protocols
- Professional security review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Disclaimer

This software is provided "as is" without warranty of any kind. Use at your own risk. 