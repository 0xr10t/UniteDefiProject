import { ethers } from "ethers"
import { executeFillOrder, callFillOrder, fillorderparameters } from "./backendrequire.js"

// Example usage of the fillOrder functions
async function exampleUsage() {
  try {
    // Connect to the network
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    
    // Contract address for the LimitOrderProtocol
    const contractAddress = "0x5ae1afcd924bf1a0ec576b0d7740cabbc9f4f356" // Replace with actual contract address
    
    console.log("Starting fill order execution...")
    
    // Method 1: Use the complete executeFillOrder function
    const result1 = await executeFillOrder(contractAddress, signer)
    console.log("Result from executeFillOrder:", result1)
    
    // Method 2: Get order data separately and then call fillOrder
    const orderData = await fillorderparameters()
    console.log("Order data:", orderData)
    
    const result2 = await callFillOrder(contractAddress, signer, orderData)
    console.log("Result from callFillOrder:", result2)
    
  } catch (error) {
    console.error("Error in example usage:", error)
  }
}

// Example of how to connect and call fillOrder step by step
async function stepByStepExample() {
  try {
    // 1. Connect to provider and get signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    
    // 2. Create contract instance
    const contractAddress = "0x5ae1afcd924bf1a0ec576b0d7740cabbc9f4f356"
    const abi = [
      "function fillOrder((uint256,address,address,address,address,uint256,uint256,uint256),bytes32,bytes32,uint256,uint256) external payable"
    ]
    const limitOrderContract = new ethers.Contract(contractAddress, abi, signer)
    
    // 3. Get order data
    const orderData = await fillorderparameters()
    
    // 4. Format order as tuple
    const order = [
      ethers.BigNumber.from(orderData.orderfilled.salt),
      orderData.orderfilled.maker,
      orderData.orderfilled.receiver,
      orderData.orderfilled.makerAsset.trim(),
      orderData.orderfilled.takerAsset,
      ethers.BigNumber.from(orderData.orderfilled.makingAmount),
      ethers.BigNumber.from(orderData.orderfilled.takingAmount),
      ethers.BigNumber.from(orderData.orderfilled.makerTraits)
    ]
    
    // 5. Prepare parameters
    const r = orderData.r
    const vs = ethers.BigNumber.from(orderData.vs)
    const amount = ethers.BigNumber.from(orderData.amount)
    const takerTraits = ethers.BigNumber.from(orderData.takerTraits)
    
    // 6. Call fillOrder
    const tx = await limitOrderContract.fillOrder(order, r, vs, amount, takerTraits)
    console.log("Transaction hash:", tx.hash)
    
    // 7. Wait for confirmation
    const receipt = await tx.wait()
    console.log("Transaction confirmed in block:", receipt.blockNumber)
    
  } catch (error) {
    console.error("Error in step by step example:", error)
  }
}

// Export for use in other modules
export { exampleUsage, stepByStepExample } 