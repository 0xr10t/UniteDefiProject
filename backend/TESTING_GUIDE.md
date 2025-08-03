# 🧪 Testing Guide - Fill Order Function

## 🚀 Quick Start (3 Steps)

### **Step 1: Start the Server**
```bash
# In the backend directory
npx serve . -p 8000
```

### **Step 2: Open Browser**
Go to: `http://localhost:8000/test.html`

### **Step 3: Test the Function**
1. Click **"Connect Wallet"** (approve in MetaMask)
2. Click **"Run Fill Order Test"**
3. Check the results in the log

## 📋 Before Testing - Update Configuration

**Important:** Update your `config.js` file with real values:

```javascript
// Open config.js and update these:
export const CONFIG = {
  NETWORK: {
    chainId: 11155111, // Your target network
  },
  CONTRACTS: {
    limitOrderProtocol: "0xYOUR_ACTUAL_CONTRACT_ADDRESS", // ← UPDATE THIS
    resolver: "0xYOUR_RESOLVER_ADDRESS" // ← UPDATE THIS
  },
  TOKENS: {
    makerAsset: "0xYOUR_MAKER_TOKEN_ADDRESS", // ← UPDATE THIS
    takerAsset: "0xYOUR_TAKER_TOKEN_ADDRESS"  // ← UPDATE THIS
  },
  ORDER: {
    maker: "0xYOUR_MAKER_ADDRESS", // ← UPDATE THIS
  }
}
```

## 🎯 Testing Process

### **What You'll See:**

1. **Connect Wallet Button** → Click to connect MetaMask
2. **Configuration Display** → Shows your network, wallet, and contract
3. **Test Buttons** → Run automatic or manual tests
4. **Log Output** → Real-time status and error messages

### **Expected Flow:**

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
🎉 Test completed successfully!
```

## 🔧 Alternative Testing Methods

### **Method 1: Browser Console**
```javascript
// In browser console (F12)
import('./test-runner.js').then(module => {
  const runner = new module.FillOrderTestRunner()
  runner.runCompleteTest()
})
```

### **Method 2: Direct Function Call**
```javascript
// In browser console
import('./backendrequire.js').then(module => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  module.executeFillOrder("YOUR_CONTRACT_ADDRESS", signer)
})
```

## 🐛 Troubleshooting

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| "MetaMask not installed" | Install MetaMask browser extension |
| "Contract address not set" | Update `config.js` with real contract address |
| "Wrong network" | Switch to correct network in MetaMask |
| "Insufficient funds" | Add more ETH to wallet |
| "Transaction failed" | Check error message in log |

### **Debug Steps:**
1. **Check browser console** (F12) for detailed errors
2. **Verify contract deployment** on block explorer
3. **Check token balances** in MetaMask
4. **Ensure correct network** is selected

## 📊 Test Results

### **Success Indicators:**
- ✅ "Fill order successful!" message
- ✅ Transaction hash displayed
- ✅ Block explorer link provided
- ✅ Gas used information shown

### **Failure Indicators:**
- ❌ "Fill order failed" message
- ❌ Error details in log
- ❌ No transaction hash

## 🎯 Next Steps After Testing

1. **If Success:** 
   - Update amounts for real usage
   - Test with different parameters
   - Move to mainnet (carefully!)

2. **If Failure:**
   - Check error messages
   - Verify contract deployment
   - Update configuration values
   - Try with smaller amounts

## 📞 Need Help?

- **Check the log output** for specific error messages
- **Verify all addresses** are correct in `config.js`
- **Ensure sufficient ETH** for gas fees
- **Test with small amounts** first 