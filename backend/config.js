// Configuration file for fillOrder function
export const CONFIG = {
  // Network Configuration
  NETWORK: {
    chainId: 11155111, // Sepolia testnet - change to your target network
    name: "Sepolia Testnet" // Change to your network name
  },
  
  // Contract Addresses
  CONTRACTS: {
    limitOrderProtocol: "0xab0170fE3A9168B01125B65776f0add464141Fe6", // SimpleLimitOrderProtocol contract
    resolver: "0x0000000000000000000000000000000000000000" // Your resolver contract
  },
  
  // Token Addresses (Update these with real token addresses)
  TOKENS: {
    makerAsset: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", // WETH on Sepolia
    takerAsset: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37"  // USDC on Sepolia
  },
  
  // Order Configuration
  ORDER: {
    maker: "0x7bCf5e99e9377cfAc3C20092317b1E95b5C772Bb", // Your maker address
    receiver: "0x0000000000000000000000000000000000000000", // Zero address for now
    salt: 2,
    makingAmount: 100, // Amount in wei/smallest unit
    takingAmount: 500,  // Amount in wei/smallest unit
    fillAmount: 500     // Amount to fill
  },
  
  // Traits Configuration
  TRAITS: {
    allowMultipleFills: false,
    allowPartialFills: false,
    usePermit2: false,
    hashLock: true,
    argsHasTarget: true,
    argsInteractionLength: 32,
    argsExtensionLength: 0
  }
}

// Helper function to get network-specific settings
export function getNetworkConfig(chainId) {
  const networks = {
    1: { // Ethereum Mainnet
      name: "Ethereum Mainnet",
      explorer: "https://etherscan.io"
    },
    11155111: { // Sepolia
      name: "Sepolia Testnet", 
      explorer: "https://sepolia.etherscan.io"
    },
    137: { // Polygon
      name: "Polygon",
      explorer: "https://polygonscan.com"
    },
    56: { // BSC
      name: "BSC",
      explorer: "https://bscscan.com"
    }
  }
  
  return networks[chainId] || networks[11155111] // Default to Sepolia
} 