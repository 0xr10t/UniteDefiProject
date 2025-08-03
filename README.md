# MeowSwap Backend 🚀

Welcome to the **MeowSwap Backend** – the engine behind cross-chain DeFi swaps, Dutch auctions, and limit orders, with a special focus on the Tron blockchain. This backend combines smart contracts, order management scripts, and robust API services to deliver secure, efficient, and scalable cross-chain trading.

---

## 🏗️ Tron-Centric Architecture

MeowSwap leverages the Tron blockchain for fast, low-fee transactions and reliable smart contract execution.

### 🔑 Key Tron Features

- **Tronbox Integration**

  - Uses [Tronbox](https://github.com/tronprotocol/tron-box) for compiling, testing, and deploying smart contracts.
  - `tronbox.js` configures endpoints, keys, and deployment parameters.
  - Contracts in [`resolver/cross-chain-resolver-example/contracts/`](backend/resolver/cross-chain-resolver-example/contracts/) are Tron-compatible.

- **Tron Smart Contracts**

  - Written in Solidity, optimized for Tron VM.
  - Enable cross-chain swaps, Dutch auctions, and order resolution.

- **Order Management**

  - Scripts in [`maker/`](backend/maker/) and [`resolver/`](backend/resolver/) create, sign, and resolve orders for Tron contracts.
  - Orders signed with Tron private keys and broadcast to the network.

- **Testing & Simulation**
  - Use Tronbox for local testing and simulation.
  - Automated tests ensure reliability and security.

---

## 📁 Folder Structure

```
backend/
├── maker/                # Order creation & signing scripts (Tron compatible)
├── resolver/             # Order resolution logic & smart contracts
│   ├── cross-chain-resolver-example/
│   │   ├── contracts/    # Solidity contracts for Tron
│   │   ├── tronbox.js    # Tronbox deployment config
│   │   ├── tests/        # Automated contract tests
│   │   └── .env.example  # Example environment variables
│   └── lib/forge-std/    # Foundry standard library (optional)
├── index.js              # API server (Express, TronWeb integration)
├── models/order.js       # Mongoose schema for order storage
├── .env                  # Secrets (Tron keys, endpoints)
└── README.md
```

---

## ⚙️ Components

### 1. **Order Maker [`maker/`](backend/maker/)**

- [`create_order.js`](backend/maker/create_order.js): Create new swap orders for Tron contracts.
- [`signer.js`](backend/maker/signer.js): Sign orders using Tron private keys.
- [`getorder.js`](backend/maker/getorder.js): Retrieve orders, including Tron orders.

### 2. **Order Resolver [`resolver/`](backend/resolver/)**

- [`cross-chain-resolver-example/contracts/`](backend/resolver/cross-chain-resolver-example/contracts/): Solidity contracts for Tron swaps and auctions.
- [`tronbox.js`](backend/resolver/cross-chain-resolver-example/tronbox.js): Deployment config for Tron.
- [`tests/`](backend/resolver/cross-chain-resolver-example/tests/): Automated contract tests.

### 3. **API Server**

- [`index.js`](backend/index.js): Express server with TronWeb integration.
- [`models/order.js`](backend/models/order.js): MongoDB schema for Tron-centric orders.

---

## 🚀 Getting Started (Tron Focus)

### Prerequisites

- Node.js & npm
- Tronbox (`npm install -g tronbox`)
- TronWeb
- MongoDB

### Environment Setup

1. Copy `.env.example` to `.env` and fill in:

   - Tron private keys
   - Tron node endpoints
   - MongoDB URI

2. Install dependencies:

   ```bash
   cd backend/maker
   npm install

   cd ../resolver/cross-chain-resolver-example
   npm install
   ```

### Deploying Contracts to Tron

```bash
cd backend/resolver/cross-chain-resolver-example
tronbox migrate --network shasta   # For Tron testnet
```

### Creating and Signing Orders

```bash
cd backend/maker
node create_order.js
```

### Running the API Server

```bash
cd backend
node index.js
```

---

## 🛠️ Smart Contract Development for Tron

- Solidity contracts are Tron VM compatible.
- [`tronbox.js`](backend/resolver/cross-chain-resolver-example/tronbox.js) manages deployment.
- Use TronWeb in scripts for contract interaction.
- Test with Tronbox CLI and local testnets.

---

## 🔒 Security

- Store Tron private keys in `.env` (never commit).
- Order signing uses Tron cryptography.
- Contracts tested for vulnerabilities via Tronbox and scripts.

---

## 🧩 Troubleshooting Tron Integration

- Deployment errors: Check `tronbox.js` for correct network/key.
- Contract interaction: Ensure TronWeb is configured.
- Order signing: Validate Tron private key format.

---

## 🌱 Future Goals

- **Automated Order Matching** 🤖  
  AI-driven matching for optimal liquidity (in progress).

- **Advanced Analytics Dashboard** 📊  
  Real-time stats, chain comparison, and fee insights.

- **Mobile App Integration** 📱  
  Seamless trading experience on mobile devices.

- **Multi-Chain Expansion** 🌐  
  Support for Solana, Polygon, and other blockchains.

- **On-Chain Governance** 🗳️  
  Decentralized protocol upgrades and voting.

---

## 🤝 Contribution

1. Fork and clone the repo.
2. Install dependencies.
3. Use feature branches for changes.
4. Test contracts/scripts on Tron testnet.
5. Submit a pull request.

---

## 📄 License

MIT License © MeowSwap Team

---

## 💬 Contact

For Tron-specific support, open an issue or contact the MeowSwap team.
