// Use global ethers from CDN instead of importing
// import { ethers } from "ethers"
// buildMakerTraits will be defined locally since we can't import from npm in browser

// Contract ABI for the SimpleLimitOrderProtocol functions
const LIMIT_ORDER_PROTOCOL_ABI = [
  "function fillOrder((uint256,address,address,address,address,address,uint256,uint256,uint256,bytes,bytes32,uint256,uint256,uint256),bytes,uint256,uint256) external",
  "function fund() external payable"
]

const domain = {
  name: "Simple Limit Order Protocol",
  version: "1",
  chainId: 11155111,
  verifyingContract: "0x603a0b8aed412116875de035b8d31d35e1e1ca18"
}

const types = {
    Order:[
    { name: "salt", type: "uint256" },
    { name: "makerAsset", type: "address" },
    { name: "takerAsset", type: "address" },
    { name: "maker", type: "address" },
    { name: "receiver", type: "address" },
    { name: "allowedSender", type: "address" },
    { name: "makingAmount", type: "uint256" },
    { name: "takingAmount", type: "uint256" },
    { name: "offsets", type: "uint256" },
    { name: "interactions", type: "bytes" },
    { name: "hashlock", type: "bytes32" },
    { name: "withdrawalStart", type: "uint256" },
    { name: "cancellationStart", type: "uint256" },
    { name: "safetyDeposit", type: "uint256" }
    ]
}

// Function to build maker traits (local implementation)
function buildMakerTraits({
  allowMultipleFills = false,
  allowPartialFills = false,
  usePermit2 = false,
  hashLock = false,
}) {
  let traits = 0n;

  if (allowMultipleFills) traits |= 1n << 255n;
  if (allowPartialFills)  traits |= 1n << 253n;
  if (usePermit2)         traits |= 1n << 252n;
  if (hashLock)           traits |= 1n << 250n;

  return traits.toString(); // use this as makerTraits
}

// Create message object inside signMessage function to avoid hoisting issues
async function signMessage() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, {
    name: 'sepolia',
    chainId: 11155111
  }) 
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  
  // Generate secret and message inside the function
  const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32))
  const hashlock = ethers.utils.keccak256(secret)
  
  // Get current timestamp
  const now = Math.floor(Date.now() / 1000)
  const withdrawalStart = now + 3600 // 1 hour from now
  const cancellationStart = now + 1800 // 30 minutes from now
  
  const message = {
    salt: 2,
    makerAsset: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    takerAsset: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
    maker: "0x7bCf5e99e9377cfAc3C20092317b1E95b5C772Bb",
    receiver: "0x7bCf5e99e9377cfAc3C20092317b1E95b5C772Bb", // Set to maker address
    allowedSender: "0x0000000000000000000000000000000000000000",
    makingAmount: ethers.utils.parseEther("0.001"),
    takingAmount: ethers.utils.parseEther("0.001"),
    offsets: 0,
    interactions: "0x",
    hashlock: hashlock,
    withdrawalStart: withdrawalStart,
    cancellationStart: cancellationStart,
    safetyDeposit: ethers.utils.parseEther("0.001")
  }
  
  const signature = await signer._signTypedData(domain, types, message) 
  return signature
}

const fillorderparameters = async () => {
  // Generate secret inside the function to avoid hoisting issues
  const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32))
  const hashlock = ethers.utils.keccak256(secret)
  
  // Get current timestamp
  const now = Math.floor(Date.now() / 1000)
  const withdrawalStart = now + 3600 // 1 hour from now
  const cancellationStart = now + 1800 // 30 minutes from now
  
  const orderfilled = {
    salt: 2,
    makerAsset: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    takerAsset: "0xd3B42F8FB5c6Ef373801B3C6b08915250350566E",
    maker: "0x7bCf5e99e9377cfAc3C20092317b1E95b5C772Bb",
    receiver: "0x7bCf5e99e9377cfAc3C20092317b1E95b5C772Bb", // Set to maker address
    allowedSender: "0x0000000000000000000000000000000000000000", // Zero address for public orders
    makingAmount: ethers.utils.parseEther("0.001"), // Use proper token amounts
    takingAmount: ethers.utils.parseEther("0.001"), // Use proper token amounts
    offsets: 0,
    interactions: "0x", // Empty interactions
    hashlock: hashlock,
    withdrawalStart: withdrawalStart,
    cancellationStart: cancellationStart,
    safetyDeposit: ethers.utils.parseEther("0.001") // Set proper safety deposit
  }
  
  const sig = await signMessage()
  
  return { 
    orderfilled, 
    signature: sig, 
    makingAmount: ethers.utils.parseEther("0.001"), 
    takingAmount: ethers.utils.parseEther("0.001") 
  }
}

// Old functions removed - using new SimpleLimitOrderProtocol structure

// Function to fund the contract with ETH
async function fundContract(contractAddress, signer, amount) {
  try {
    const limitOrderContract = new ethers.Contract(contractAddress, LIMIT_ORDER_PROTOCOL_ABI, signer);
    const tx = await limitOrderContract.fund({ value: amount });
    await tx.wait();
    console.log("Contract funded successfully");
    return true;
  } catch (error) {
    console.error("Error funding contract:", error);
    return false;
  }
}

// Function to approve tokens for the contract
async function approveTokens(tokenAddress, contractAddress, signer, amount) {
  try {
    const tokenABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function balanceOf(address owner) external view returns (uint256)"
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    
    // Check if token contract is valid by calling balanceOf
    try {
      const balance = await tokenContract.balanceOf(await signer.getAddress());
      console.log(`Token ${tokenAddress} balance: ${ethers.utils.formatEther(balance)}`);
    } catch (error) {
      console.error(`Token ${tokenAddress} is not a valid ERC20 token:`, error.message);
      return false;
    }
    
    // Check current allowance
    try {
      const currentAllowance = await tokenContract.allowance(await signer.getAddress(), contractAddress);
      console.log(`Current allowance for ${tokenAddress}: ${ethers.utils.formatEther(currentAllowance)}`);
      
      if (currentAllowance.lt(amount)) {
        console.log(`Approving ${ethers.utils.formatEther(amount)} for ${tokenAddress}...`);
        const tx = await tokenContract.approve(contractAddress, amount);
        await tx.wait();
        console.log(`Token ${tokenAddress} approved successfully`);
      } else {
        console.log(`Token ${tokenAddress} already has sufficient allowance`);
      }
      return true;
    } catch (error) {
      console.error(`Error checking/approving allowance for ${tokenAddress}:`, error.message);
      return false;
    }
  } catch (error) {
    console.error("Error approving tokens:", error);
    return false;
  }
}

// Function to call fillOrder on the SimpleLimitOrderProtocol contract
async function callFillOrder(contractAddress, signer, orderData) {
  try {
    // Create contract instance
    const limitOrderContract = new ethers.Contract(contractAddress, LIMIT_ORDER_PROTOCOL_ABI, signer);
    
    // Format the order properly as a tuple
    const order = [
      ethers.BigNumber.from(orderData.orderfilled.salt),
      orderData.orderfilled.makerAsset.trim(), // Strip any spaces from addresses
      orderData.orderfilled.takerAsset,
      orderData.orderfilled.maker,
      orderData.orderfilled.receiver,
      orderData.orderfilled.allowedSender,
      ethers.BigNumber.from(orderData.orderfilled.makingAmount),
      ethers.BigNumber.from(orderData.orderfilled.takingAmount),
      ethers.BigNumber.from(orderData.orderfilled.offsets),
      orderData.orderfilled.interactions,
      orderData.orderfilled.hashlock,
      ethers.BigNumber.from(orderData.orderfilled.withdrawalStart),
      ethers.BigNumber.from(orderData.orderfilled.cancellationStart),
      ethers.BigNumber.from(orderData.orderfilled.safetyDeposit)
    ];
    
    // Construct other parameters
    const signature = orderData.signature;
    const makingAmount = ethers.BigNumber.from(orderData.makingAmount);
    const takingAmount = ethers.BigNumber.from(orderData.takingAmount);
    
    // Optional: Log calldata for debugging
    const iface = new ethers.utils.Interface(LIMIT_ORDER_PROTOCOL_ABI);
    const calldata = iface.encodeFunctionData("fillOrder", [order, signature, makingAmount, takingAmount]);
    console.log("Calldata:", calldata);
    
    // Call fillOrder function - the contract should already have ETH balance for escrow creation
    const tx = await limitOrderContract.fillOrder(order, signature, makingAmount, takingAmount);
    
    console.log("Transaction hash:", tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
    
  } catch (error) {
    console.error("Error calling fillOrder:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to get order data and call fillOrder
async function executeFillOrder(contractAddress, signer) {
  try {
    // Get the order parameters from the off-chain function
    const orderData = await fillorderparameters();
    
    // Fund the contract first with safety deposit amount
    const safetyDepositAmount = ethers.utils.parseEther("0.001");
    const funded = await fundContract(contractAddress, signer, safetyDepositAmount);
    
    if (!funded) {
      return {
        success: false,
        error: "Failed to fund contract"
      };
    }
    
    // Approve tokens for the contract
    const makerAsset = orderData.orderfilled.makerAsset.trim();
    const takerAsset = orderData.orderfilled.takerAsset;
    const makingAmount = orderData.makingAmount;
    const takingAmount = orderData.takingAmount;
    
    console.log("Checking token balances and approvals...");
    console.log(`Maker Asset: ${makerAsset}`);
    console.log(`Taker Asset: ${takerAsset}`);
    console.log(`Making Amount: ${ethers.utils.formatEther(makingAmount)}`);
    console.log(`Taking Amount: ${ethers.utils.formatEther(takingAmount)}`);
    
    // Approve maker asset (for the maker)
    console.log("Approving maker asset...");
    const makerApproved = await approveTokens(makerAsset, contractAddress, signer, makingAmount);
    if (!makerApproved) {
      return {
        success: false,
        error: "Failed to approve maker asset"
      };
    }
    
    // Approve taker asset (for the taker/msg.sender)
    console.log("Approving taker asset...");
    const takerApproved = await approveTokens(takerAsset, contractAddress, signer, takingAmount);
    if (!takerApproved) {
      return {
        success: false,
        error: "Failed to approve taker asset"
      };
    }
    
    // Call the fillOrder function
    console.log("Calling fillOrder...");
    const result = await callFillOrder(contractAddress, signer, orderData);
    
    return result;
    
  } catch (error) {
    console.error("Error executing fill order:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export functions for use in other modules
export {
  callFillOrder,
  executeFillOrder,
  fillorderparameters,
  buildMakerTraits,
  fundContract,
  approveTokens
}; 