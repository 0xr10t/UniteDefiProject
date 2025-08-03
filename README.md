# UniteDefi Project

A decentralized finance (DeFi) project focused on cross-chain limit order execution with escrow functionality.

## 🚀 Overview

This project implements a limit order protocol that allows users to create and fill orders across different blockchain networks. It includes:

- **SimpleLimitOrderProtocol**: A smart contract for creating and filling limit orders
- **Escrow Integration**: Automatic escrow creation for secure cross-chain transactions
- **Web Interface**: Browser-based testing interface for order creation and execution
- **JavaScript SDK**: Off-chain utilities for order parameter generation and signing

## 📁 Project Structure

```
UniteDefiProject/
├── backend/                          # Backend JavaScript files
│   ├── backendrequire.js             # Main SDK for order operations
│   ├── config.js                     # Configuration settings
│   ├── test-runner.js                # Test runner class
│   ├── makercreatesorder.js          # Order creation utilities
│   ├── test.html                     # Main testing interface
│   ├── simple-test.html              # Basic connection test
│   ├── basic-test.html               # Minimal test page
│   └── QUICK_START.md               # Quick start guide
├── contracts/                        # Smart contract files
│   ├── cross-chain-resolver-example/ # Example resolver contracts
│   │   ├── contracts/
│   │   │   ├── src/
│   │   │   │   ├── Resolver.sol      # Cross-chain resolver
│   │   │   │   └── TestEscrowFactory.sol
│   │   │   └── tests/                # Contract tests
│   └── src/
│       └── Counter.sol               # Example contract
└── README.md                         # This file
```

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: 0.8.23
- **OpenZeppelin**: For security and standard contracts
- **Foundry**: For testing and deployment

### Frontend/Backend
- **JavaScript**: Core logic and utilities
- **Ethers.js**: Blockchain interaction
- **HTML/CSS**: User interface
- **MetaMask**: Wallet integration

### Networks
- **Sepolia Testnet**: Primary testing network
- **Ethereum Mainnet**: Production deployment
- **Cross-chain**: Support for multiple networks

## 🚀 Quick Start

### Prerequisites

1. **MetaMask**: Install and configure MetaMask wallet
2. **Sepolia ETH**: Get test ETH from Sepolia faucet
3. **Test Tokens**: Ensure you have test tokens on Sepolia

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd UniteDefiProject
   ```

2. **Start the local server**:
   ```bash
   cd backend
   python3 -m http.server 8000
   # or
   npx serve . -p 8000
   ```

3. **Open the test interface**:
   ```
   http://localhost:8000/test.html
   ```

### Testing

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Run Test**: Click "Run Fill Order Test" to execute a complete test
3. **Manual Test**: Use "Manual Test" for step-by-step execution
4. **Check Logs**: Monitor the log area for detailed execution information

## 📋 Configuration

### Network Settings

The project is configured for Sepolia testnet by default:

```javascript
// config.js
export const CONFIG = {
  NETWORK: { 
    chainId: 11155111, 
    name: "Sepolia Testnet" 
  },
  CONTRACTS: { 
    limitOrderProtocol: "0xab0170fE3A9168B01125B65776f0add464141Fe6"
  }
}
```

### Token Addresses

Update token addresses in `config.js`:

```javascript
TOKENS: {
  makerAsset: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH
  takerAsset: "0xd3B42F8FB5c6Ef373801B3C6b08915250350566E"  // USDC
}
```

## 🔧 Smart Contract Integration

### SimpleLimitOrderProtocol

The main contract handles order creation and execution:

```solidity
function fillOrder(
    Order calldata order,
    bytes calldata signature,
    uint256 makingAmount,
    uint256 takingAmount
) external whenNotPaused
```

### Order Structure

```solidity
struct Order {
    uint256 salt;
    address makerAsset;
    address takerAsset;
    address maker;
    address receiver;
    address allowedSender;
    uint256 makingAmount;
    uint256 takingAmount;
    uint256 offsets;
    bytes interactions;
    bytes32 hashlock;
    uint256 withdrawalStart;
    uint256 cancellationStart;
    uint256 safetyDeposit;
}
```

## 📚 API Reference

### Core Functions

#### `fillorderparameters()`
Generates order parameters and signature for limit order creation.

**Returns:**
```javascript
{
  orderfilled: Order,
  signature: string,
  makingAmount: BigNumber,
  takingAmount: BigNumber
}
```

#### `executeFillOrder(contractAddress, signer)`
Executes a complete fill order operation.

**Parameters:**
- `contractAddress`: Contract address
- `signer`: Ethers.js signer object

**Returns:**
```javascript
{
  success: boolean,
  txHash?: string,
  blockNumber?: number,
  gasUsed?: string,
  error?: string
}
```

#### `callFillOrder(contractAddress, signer, orderData)`
Calls the fillOrder function on the smart contract.

#### `fundContract(contractAddress, signer, amount)`
Funds the contract with ETH for escrow creation.

#### `approveTokens(tokenAddress, contractAddress, signer, amount)`
Approves tokens for the contract to spend.

### Test Runner

#### `FillOrderTestRunner`
Class for running comprehensive tests:

```javascript
const runner = new FillOrderTestRunner();
await runner.runCompleteTest();
```

## 🔍 Testing

### Test Files

1. **`test.html`**: Complete testing interface
2. **`simple-test.html`**: Basic connection test
3. **`basic-test.html`**: Minimal test without external dependencies

### Test Flow

1. **Initialization**: Connect to wallet and network
2. **Configuration**: Validate contract and token addresses
3. **Order Generation**: Create order parameters and signature
4. **Contract Funding**: Fund contract with ETH
5. **Token Approval**: Approve tokens for contract
6. **Order Execution**: Call fillOrder function
7. **Result Verification**: Check transaction success

## 🚨 Troubleshooting

### Common Issues

#### MetaMask Connection
- **Issue**: "MetaMask is not installed"
- **Solution**: Install MetaMask browser extension

#### Network Issues
- **Issue**: "network does not support ENS"
- **Solution**: Ensure you're connected to Sepolia testnet

#### Token Approval Errors
- **Issue**: "call revert exception" during token approval
- **Solution**: Check if token addresses are valid ERC20 tokens

#### Gas Estimation Errors
- **Issue**: "UNPREDICTABLE_GAS_LIMIT"
- **Solution**: Ensure contract has sufficient ETH balance

### Debug Mode

Enable detailed logging by checking the browser console for:
- Contract interactions
- Token balances
- Transaction details
- Error messages

## 🔐 Security Considerations

### Smart Contract Security
- Use audited OpenZeppelin contracts
- Implement proper access controls
- Test thoroughly on testnets
- Consider formal verification

### Frontend Security
- Validate all user inputs
- Use HTTPS in production
- Implement proper error handling
- Secure private key management

## 📈 Development

### Adding New Features

1. **Smart Contracts**: Add new contracts to `contracts/` directory
2. **Frontend**: Update JavaScript files in `backend/`
3. **Testing**: Add test cases and update test interfaces
4. **Documentation**: Update README and add inline comments

### Deployment

1. **Testnet**: Deploy to Sepolia for testing
2. **Mainnet**: Deploy to Ethereum mainnet for production
3. **Verification**: Verify contracts on Etherscan
4. **Configuration**: Update contract addresses in config

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the test logs for error details

## 🔄 Version History

- **v1.0.0**: Initial release with basic limit order functionality
- **v1.1.0**: Added escrow integration
- **v1.2.0**: Enhanced testing interface
- **v1.3.0**: Cross-chain resolver support

---

**Note**: This is a development project. Always test thoroughly on testnets before using on mainnet. 