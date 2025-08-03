# 🚀 Quick Start Guide - Fill Order Function

## 📋 Prerequisites

1. **MetaMask installed** and connected to the correct network
2. **Your contract deployed** and address updated in `config.js`
3. **Sufficient ETH** for gas fees
4. **Required tokens** in your wallet

## 🎯 Step-by-Step Process

### **Step 1: Update Configuration**

Edit `config.js` and update these values:

```javascript
export const CONFIG = {
  NETWORK: {
    chainId: 11155111, // Change to your target network
    name: "Sepolia Testnet"
  },
  CONTRACTS: {
    limitOrderProtocol: "0xYOUR_ACTUAL_CONTRACT_ADDRESS", // Your deployed contract
    resolver: "0xYOUR_RESOLVER_ADDRESS" // Your resolver contract
  },
  TOKENS: {
    makerAsset: "0xYOUR_MAKER_TOKEN_ADDRESS", // Real token address
    takerAsset: "0xYOUR_TAKER_TOKEN_ADDRESS"  // Real token address
  },
  ORDER: {
    maker: "0xYOUR_MAKER_ADDRESS", // Your wallet address
    // ... other settings
  }
}
```

### **Step 2: Test in Browser**

1. **Open the test page:**
   ```bash
   # Start a local server (if needed)
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/test.html
   ```

3. **Click "Connect Wallet"** and approve in MetaMask

4. **Click "Run Fill Order Test"** to execute

### **Step 3: Check Results**

- ✅ **Success**: Transaction hash and block explorer link will be shown
- ❌ **Failure**: Error message will be displayed in the log

## 🔧 Alternative Methods

### **Method 1: Browser Console**

```javascript
// Import and run
import('./test-runner.js').then(module => {
  const runner = new module.FillOrderTestRunner()
  runner.runCompleteTest()
})
```

### **Method 2: Direct Function Call**

```javascript
import { executeFillOrder } from "./backendrequire.js"

async function quickTest() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  
  const contractAddress = "0xYOUR_CONTRACT_ADDRESS"
  const result = await executeFillOrder(contractAddress, signer)
  console.log(result)
}

quickTest()
```

## 🐛 Troubleshooting

### **Common Issues:**

1. **"MetaMask not installed"**
   - Install MetaMask browser extension

2. **"Contract address not set"**
   - Update the contract address in `config.js`

3. **"Wrong network"**
   - Switch to the correct network in MetaMask

4. **"Insufficient funds"**
   - Add more ETH to your wallet

5. **"Transaction failed"**
   - Check the error message in the log
   - Verify contract is deployed and accessible

### **Debug Steps:**

1. **Check console logs** for detailed error messages
2. **Verify contract deployment** on block explorer
3. **Check token balances** in your wallet
4. **Ensure correct network** is selected in MetaMask

## 📊 Expected Output

**Success:**
```
🎯 Starting Fill Order Test...
🔗 Step 1: Initializing connection...
✅ Connected to wallet: 0x...
✅ Connected to network: Sepolia Testnet
✅ Contract address: 0x...
🔍 Step 2: Validating configuration...
✅ Configuration validation passed
📋 Step 3: Getting order parameters...
✅ Order parameters generated
🚀 Step 4: Executing fill order...
✅ Fill order successful!
Transaction hash: 0x...
Block number: 123456
Gas used: 150000
View transaction: https://sepolia.etherscan.io/tx/0x...
🎉 Test completed successfully!
```

**Failure:**
```
❌ Fill order failed: execution reverted
❌ Error: Transaction failed
💥 Test failed!
```

## 🔄 Next Steps

1. **Test on testnet first** before mainnet
2. **Update token addresses** with real tokens
3. **Adjust amounts** based on your requirements
4. **Monitor gas fees** and optimize if needed
5. **Add error handling** for production use

## 📞 Need Help?

- Check the console logs for detailed error messages
- Verify all addresses are correct
- Ensure sufficient funds for gas fees
- Test with small amounts first 