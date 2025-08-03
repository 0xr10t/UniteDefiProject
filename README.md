# MeowSwap Backend

This backend powers the MeowSwap cross-chain DeFi protocol, with a strong focus on the Tron blockchain. It includes smart contracts, order management scripts, and API services, all designed to facilitate secure, efficient, and scalable cross-chain swaps—especially for Tron users.

---

## Tron-Centric Architecture

MeowSwap is built to leverage the Tron blockchain for fast, low-fee transactions and robust smart contract execution. The backend integrates Tron-specific tooling, deployment scripts, and contract logic to ensure seamless operation on Tron.

### Key Tron Features

- **Tronbox Integration:**  
  The backend uses [Tronbox](https://github.com/tronprotocol/tron-box) for compiling, testing, and deploying smart contracts to the Tron network.

  - `tronbox.js` configures network endpoints, private keys, and deployment parameters.
  - Contracts in `resolver/cross-chain-resolver-example/contracts/` are Tron-compatible.

- **Tron Smart Contracts:**

  - Written in Solidity, optimized for Tron VM.
  - Support cross-chain swaps, Dutch auctions, and order resolution.
  - Can be deployed and interacted with using Tronbox CLI.

- **Tron Order Management:**

  - Scripts in `maker/` and `resolver/` are designed to create, sign, and resolve orders that interact with Tron contracts.
  - Orders can be signed using Tron private keys and broadcast to the Tron network.

- **Tron Testing & Simulation:**
  - Use Tronbox for local testing and simulation.
  - Automated tests ensure contract reliability and security on Tron.

---

## Folder Structure

```
backend/
├── maker/                # Order creation and signing scripts (Tron compatible)
├── resolver/             # Order resolution logic and smart contracts
│   ├── cross-chain-resolver-example/
│   │   ├── contracts/    # Solidity contracts for Tron
│   │   ├── tronbox.js    # Tronbox deployment config
│   │   ├── tests/        # Automated contract tests
│   │   └── .env.example  # Example environment variables for Tron
│   └── lib/forge-std/    # Foundry standard library (optional)
├── index.js              # API server (Express, can interact with Tron contracts)
├── models/order.js       # Mongoose schema for order storage
├── .env                  # Secrets (Tron private keys, endpoints)
└── README.md
```

---

## Components

### 1. **Order Maker (`maker/`)**

- **create_order.js**: Create new swap orders, formatted for Tron contracts.
- **signer.js**: Sign orders using Tron private keys.
- **getorder.js**: Retrieve orders, including those on Tron.

### 2. **Order Resolver (`resolver/`)**

- **cross-chain-resolver-example/contracts/**:  
  Solidity contracts for Tron, handling swaps and auctions.
- **tronbox.js**:  
  Configuration for deploying contracts to Tron mainnet or testnet.
- **tests/**:  
  Automated tests for Tron contracts.

### 3. **API Server**

- **index.js**:  
  Express server that can interact with Tron contracts via TronWeb or Tronbox.
- **models/order.js**:  
  MongoDB schema for storing Tron-centric orders.

---

## Getting Started (Tron Focus)

### Prerequisites

- **Node.js & npm**
- **Tronbox**:  
  Install globally with `npm install -g tronbox`
- **TronWeb**:  
  For interacting with Tron contracts in scripts.
- **MongoDB**:  
  For order storage.

### Environment Setup

1. Copy `.env.example` to `.env` and fill in:

   - Tron private keys
   - Tron node endpoints (mainnet/testnet)
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

## Smart Contract Development for Tron

- **Solidity contracts** are written for Tron VM compatibility.
- **tronbox.js** manages deployment settings.
- **TronWeb** can be used in scripts for contract interaction.
- **Testing**: Use Tronbox CLI and local testnets for simulation.

---

## Security

- **Private keys** for Tron must be stored in `.env` and never committed.
- **Order signing** uses Tron cryptography.
- **Contracts** are tested for vulnerabilities using Tronbox and automated scripts.

---

## Troubleshooting Tron Integration

- **Deployment errors**: Check `tronbox.js` for correct network and private key.
- **Contract interaction issues**: Ensure TronWeb is properly configured.
- **Order signing problems**: Validate Tron private key format.

---

## Contribution

1. Fork and clone the repo.
2. Install dependencies.
3. Use feature branches for changes.
4. Test contracts and scripts on Tron testnet.
5. Submit a pull request.

---

## License

MIT License © MeowSwap Team

---

## Contact

For Tron-specific support, open an issue or contact the MeowSwap team.
