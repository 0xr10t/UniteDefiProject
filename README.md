# UniteDefiProject

A comprehensive DeFi project that combines cross-chain atomic swaps, HTLC (Hash Time Lock Contract) implementation on Sui blockchain, and a modern React frontend interface.

## 🚀 Project Overview

UniteDefiProject is a decentralized finance (DeFi) solution that enables secure cross-chain atomic swaps using Hash Time Lock Contracts (HTLC) on the Sui blockchain. The project consists of three main components:

- **Frontend**: Modern React application with Tailwind CSS
- **Sui Smart Contracts**: HTLC implementation in Move language
- **Cross-Chain Resolver**: Ethereum/BSC cross-chain swap functionality

## 📁 Project Structure

```
UniteDefiProject/
├── Frontend/                    # React + Vite frontend application
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
├── Sui/                       # Sui blockchain components
│   ├── Sui/                   # Move smart contracts
│   │   ├── sources/          # HTLC implementation
│   │   └── tests/            # Contract tests
│   ├── cross-chain-resolver-example/  # Cross-chain swap example
│   └── package.json          # Sui dependencies
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Blockchain
- **Sui Move** - Smart contract language for Sui blockchain
- **Ethereum/Solidity** - Cross-chain resolver contracts
- **Foundry** - Ethereum development framework

### Cross-Chain
- **1inch Cross-Chain SDK** - Cross-chain swap functionality
- **Ethers.js** - Ethereum interaction library
- **Sui.js** - Sui blockchain interaction

## 🚀 Quick Start

### Prerequisites

- Node.js (v22 or higher)
- pnpm (recommended) or npm
- Foundry (for Ethereum development)
- Sui CLI (for Sui development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UniteDefiProject
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd Frontend
   pnpm install
   ```

3. **Install Sui Dependencies**
   ```bash
   cd ../Sui
   pnpm install
   ```

4. **Install Cross-Chain Resolver Dependencies**
   ```bash
   cd cross-chain-resolver-example
   pnpm install
   forge install
   ```

### Running the Application

#### Frontend Development
```bash
cd Frontend
pnpm dev
```
The frontend will be available at `http://localhost:5173`

#### Sui Smart Contracts
```bash
cd Sui/Sui
sui move build
sui move test
```

#### Cross-Chain Resolver Tests
```bash
cd Sui/cross-chain-resolver-example
SRC_CHAIN_RPC=ETH_FORK_URL DST_CHAIN_RPC=BNB_FORK_URL pnpm test
```

## 🔧 Smart Contracts

### HTLC (Hash Time Lock Contract)

The core smart contract is implemented in Sui Move and provides:

- **Atomic Swaps**: Secure cross-chain token swaps
- **Time Locks**: Automatic expiration and refund mechanisms
- **Hash Locks**: Cryptographic security using SHA-256
- **Generic Support**: Works with any `Coin<T>` type

#### Key Features:
- `create()` - Create a new HTLC with locked assets
- `withdraw()` - Withdraw funds by providing the correct secret
- `cancel()` - Cancel expired HTLC and reclaim funds

### Cross-Chain Resolver

The cross-chain resolver example demonstrates:
- Ethereum to BSC token swaps
- 1inch integration for optimal routing
- Automated testing with forked networks

## 🧪 Testing

### Frontend Tests
```bash
cd Frontend
pnpm test
```

### Smart Contract Tests
```bash
cd Sui/Sui
sui move test
```

### Cross-Chain Tests
```bash
cd Sui/cross-chain-resolver-example
pnpm test
```

## 📚 API Reference

### HTLC Contract Functions

```move
// Create a new HTLC
public entry fun create<T: store>(
    hashlock: vector<u8>,
    timelock: u64,
    taker: address,
    asset: Coin<T>,
    ctx: &mut TxContext
)

// Withdraw funds from HTLC
public entry fun withdraw<T: store>(
    htlc: &mut Htlc<T>,
    secret: vector<u8>,
    ctx: &mut TxContext
)

// Cancel expired HTLC
public entry fun cancel<T: store>(
    htlc: &mut Htlc<T>,
    ctx: &mut TxContext
)
```

## 🔒 Security Features

- **Hash Time Lock Contracts**: Cryptographic security using SHA-256
- **Time-based Expiration**: Automatic refund mechanisms
- **Cross-Chain Atomic Swaps**: No counterparty risk
- **Generic Asset Support**: Works with any Sui coin type

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Project

This project was developed as part of the UniteDeFi Hackathon, showcasing innovative cross-chain DeFi solutions on the Sui blockchain.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Join our community discussions
- Check the documentation in each component's README

---

**Built with ❤️ by the CowSwap Hackathon Team**
