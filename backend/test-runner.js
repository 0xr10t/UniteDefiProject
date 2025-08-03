// Use global ethers from CDN instead of importing
// import { ethers } from "ethers"
import { executeFillOrder, callFillOrder, fillorderparameters } from "./backendrequire.js"
import { CONFIG, getNetworkConfig } from "./config.js"

class FillOrderTestRunner {
  constructor() {
    this.provider = null
    this.signer = null
    this.contractAddress = null
    this.networkConfig = null
  }

  // Step 1: Initialize connection
  async initialize() {
    try {
      console.log("🔗 Step 1: Initializing connection...")
      
      // Check if MetaMask is available
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed! Please install MetaMask first.")
      }

      // Check if ethers is available
      if (typeof ethers === 'undefined') {
        throw new Error("Ethers library not loaded! Please check the CDN.")
      }

      console.log("✅ Ethers library loaded successfully")
      
      // Connect to provider with Sepolia configuration
      this.provider = new ethers.providers.Web3Provider(window.ethereum, {
        name: 'sepolia',
        chainId: 11155111
      })
      await this.provider.send("eth_requestAccounts", [])
      this.signer = this.provider.getSigner()
      
      // Get connected address
      const address = await this.signer.getAddress()
      console.log("✅ Connected to wallet:", address)
      
      // Get network info
      const network = await this.provider.getNetwork()
      this.networkConfig = getNetworkConfig(network.chainId)
      console.log("✅ Connected to network:", this.networkConfig.name)
      console.log("✅ Chain ID:", network.chainId)
      
      // Set contract address
      this.contractAddress = CONFIG.CONTRACTS.limitOrderProtocol
      console.log("✅ Contract address:", this.contractAddress)
      
      return true
      
    } catch (error) {
      console.error("❌ Initialization failed:", error.message)
      return false
    }
  }

  // Step 2: Validate configuration
  async validateConfig() {
    try {
      console.log("\n🔍 Step 2: Validating configuration...")
      
      // Check if contract address is set
      if (!this.contractAddress || this.contractAddress === "0x0000000000000000000000000000000000000000") {
        throw new Error("Contract address not set! Please update config.js")
      }
      
      // Check if we're on the right network
      const network = await this.provider.getNetwork()
      if (network.chainId !== CONFIG.NETWORK.chainId) {
        console.warn(`⚠️ Warning: You're on chain ${network.chainId}, but config expects ${CONFIG.NETWORK.chainId}`)
      }
      
      // Check token addresses
      if (CONFIG.TOKENS.makerAsset === "0x0000000000000000000000000000000000000000") {
        console.warn("⚠️ Warning: Maker asset address not set")
      }
      if (CONFIG.TOKENS.takerAsset === "0x0000000000000000000000000000000000000000") {
        console.warn("⚠️ Warning: Taker asset address not set")
      }
      
      console.log("✅ Configuration validation passed")
      return true
      
    } catch (error) {
      console.error("❌ Configuration validation failed:", error.message)
      return false
    }
  }

  // Step 3: Get order parameters
  async getOrderParameters() {
    try {
      console.log("\n📋 Step 3: Getting order parameters...")
      
      const orderData = await fillorderparameters()
      console.log("✅ Order parameters generated")
      console.log("Order details:", {
        maker: orderData.orderfilled.maker,
        makerAsset: orderData.orderfilled.makerAsset,
        takerAsset: orderData.orderfilled.takerAsset,
        makingAmount: orderData.orderfilled.makingAmount,
        takingAmount: orderData.orderfilled.takingAmount
      })
      
      return orderData
      
    } catch (error) {
      console.error("❌ Failed to get order parameters:", error.message)
      return null
    }
  }

  // Step 4: Execute fill order
  async executeFillOrder() {
    try {
      console.log("\n🚀 Step 4: Executing fill order...")
      
      const result = await executeFillOrder(this.contractAddress, this.signer)
      
      if (result.success) {
        console.log("✅ Fill order successful!")
        console.log("Transaction hash:", result.txHash)
        console.log("Block number:", result.blockNumber)
        console.log("Gas used:", result.gasUsed)
        
        // Show explorer link
        const explorerUrl = `${this.networkConfig.explorer}/tx/${result.txHash}`
        console.log("View transaction:", explorerUrl)
        
        return result
      } else {
        console.error("❌ Fill order failed:", result.error)
        return result
      }
      
    } catch (error) {
      console.error("❌ Execution failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Step 5: Manual fill order with custom data
  async manualFillOrder(orderData) {
    try {
      console.log("\n🔧 Step 5: Manual fill order...")
      
      const result = await callFillOrder(this.contractAddress, this.signer, orderData)
      
      if (result.success) {
        console.log("✅ Manual fill order successful!")
        console.log("Transaction hash:", result.txHash)
        console.log("Block number:", result.blockNumber)
        console.log("Gas used:", result.gasUsed)
        
        const explorerUrl = `${this.networkConfig.explorer}/tx/${result.txHash}`
        console.log("View transaction:", explorerUrl)
        
        return result
      } else {
        console.error("❌ Manual fill order failed:", result.error)
        return result
      }
      
    } catch (error) {
      console.error("❌ Manual execution failed:", error.message)
      return { success: false, error: error.message }
    }
  }

  // Run complete test
  async runCompleteTest() {
    console.log("🎯 Starting Fill Order Test...")
    console.log("=" * 50)
    
    // Step 1: Initialize
    const initialized = await this.initialize()
    if (!initialized) return false
    
    // Step 2: Validate config
    const configValid = await this.validateConfig()
    if (!configValid) return false
    
    // Step 3: Get order parameters
    const orderData = await this.getOrderParameters()
    if (!orderData) return false
    
    // Step 4: Execute fill order
    const result = await this.executeFillOrder()
    
    console.log("\n" + "=" * 50)
    if (result.success) {
      console.log("🎉 Test completed successfully!")
    } else {
      console.log("💥 Test failed!")
    }
    
    return result.success
  }
}

// Export for use
export { FillOrderTestRunner }

// Make available globally for browser testing
if (typeof window !== 'undefined') {
  window.FillOrderTestRunner = FillOrderTestRunner
} 