import { ethers } from 'ethers';
import {
    SuiClient,
    getFullnodeUrl
} from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { fromHEX } from '@mysten/sui.js/utils';
import { config } from 'dotenv';
config();

// --- Helper ABIs (Simplified for this example) ---
const ESCROW_FACTORY_ABI = [
    "function createDstEscrow(tuple(bytes32,bytes32,address,address,address,uint256,uint256,uint256,bytes), uint256) external payable",
    "event DstEscrowCreated(address indexed escrow, bytes32 indexed hashlock, address indexed taker)"
];
const ESCROW_ABI = [
    "function withdraw(bytes32 secret, tuple(bytes32,bytes32,address,address,address,uint256,uint256,uint256,bytes)) external",
];


// --- CONFIGURATION (Replace with your actual data) ---
const CONFIG = {
    // Ethereum Configuration
    ETHEREUM_RPC_URL: "https://mainnet.infura.io/v3/a45850a85e654d028d3145f40ee9eae8",
    ETHEREUM_PRIVATE_KEY: process.env.PRIVATE_KEY, // Your resolver's Ethereum private key
    ETHEREUM_ESCROW_FACTORY_ADDRESS: "0x...", // Deployed 1inch EscrowFactory address on Sepolia

    // Sui Configuration
    SUI_RPC_URL: getFullnodeUrl('testnet'),
    SUI_PRIVATE_KEY: "0x...", // Your resolver's Sui private key (as hex)
    SUI_PACKAGE_ID: "0x...", // Your deployed `fusion_escrow` package ID on Sui Testnet
    SUI_COIN_TYPE_TO_PROVIDE: "0x2::sui::SUI", // The coin type resolver provides (e.g., SUI for simplicity)
};

// Validate configuration
function validateConfig() {
    const requiredFields = [
        'ETHEREUM_RPC_URL',
        'ETHEREUM_PRIVATE_KEY', 
        'ETHEREUM_ESCROW_FACTORY_ADDRESS',
        'SUI_PRIVATE_KEY',
        'SUI_PACKAGE_ID'
    ] as const;
    
    for (const field of requiredFields) {
        if (CONFIG[field] === "0x..." || CONFIG[field] === "YOUR_INFURA_ID") {
            throw new Error(`❌ Configuration Error: Please set a valid value for ${field} in the CONFIG object.`);
        }
    }
}

class ResolverBot {
    // EVM connections
    ethProvider: ethers.JsonRpcProvider;
    ethWallet: ethers.Wallet;
    escrowFactory: ethers.Contract;

    // Sui connections
    suiClient: SuiClient;
    suiKeypair: Ed25519Keypair;

    constructor() {
        // Validate configuration first
        validateConfig();
        
        // --- Initialize Ethereum Connection ---
        this.ethProvider = new ethers.JsonRpcProvider(CONFIG.ETHEREUM_RPC_URL);
        this.ethWallet = new ethers.Wallet(CONFIG.ETHEREUM_PRIVATE_KEY, this.ethProvider);
        this.escrowFactory = new ethers.Contract(CONFIG.ETHEREUM_ESCROW_FACTORY_ADDRESS, ESCROW_FACTORY_ABI, this.ethWallet);

        // --- Initialize Sui Connection ---
        this.suiClient = new SuiClient({ url: CONFIG.SUI_RPC_URL });
        // Sui private key is typically a Base64 string, but for simplicity we assume it's hex from the keypair
        const rawSuiKey = fromHEX(CONFIG.SUI_PRIVATE_KEY);
        this.suiKeypair = Ed25519Keypair.fromSecretKey(rawSuiKey.slice(1)); // slice(1) to remove scheme flag
    }
    
    /**
     * Main execution loop. In a real bot, this would fetch orders from the 1inch API.
     * Here, we simulate handling a single, hardcoded order.
     */
    async run() {
        console.log("🤖 Resolver Bot starting...");
        console.log(`Ethereum Address: ${this.ethWallet.address}`);
        console.log(`Sui Address: ${this.suiKeypair.getPublicKey().toSuiAddress()}`);
        
        // --- Simulate a Mock Order for an ETH -> Sui Swap ---
        const mockOrder = {
            userEthAddress: "0xUSER_ETH_ADDRESS",
            userSuiAddress: "0xUSER_SUI_ADDRESS",
            ethAmount: ethers.parseEther("0.01"),
            suiAmount: 1_000_000_000, // 1 SUI
            secret: "0x" + Buffer.from("hello sui").toString('hex'), // The secret preimage
            hashlock: "0x062821dd4b2050e1d0a51c2034942125191a8563c6b653f5a2a225345b599321", // keccak256("hello sui")
            timelock: Date.now() + 3_600_000, // 1 hour from now
        };

        await this.handleEthToSuiSwap(mockOrder);
    }

    /**
     * Handles the entire lifecycle of an Ethereum -> Sui swap.
     */
    async handleEthToSuiSwap(order: any) {
        console.log("\n--- Handling Ethereum -> Sui Swap ---");
        console.log(`Order Details: ${order.ethAmount.toString()} ETH for ${order.suiAmount} MIST`);

        try {
            // == PHASE 1: LOCK ASSETS ON BOTH CHAINS (Resolver's Job) ==

            // 1. Lock User's assets on Ethereum (Simulated)
            // In the real Fusion+ system, the resolver would call the Limit Order Protocol
            // which in turn deploys the EscrowSrc contract and locks the user's funds.
            // We'll simulate this step as a success and assume an EscrowSrc contract exists.
            console.log("[1/4]  simulating lock on Ethereum... (LOP fillOrder)");
            const mockEthEscrowAddress = "0xMOCK_ETH_ESCROW_ADDRESS";
            console.log(`✅ User's ETH locked in EscrowSrc at ${mockEthEscrowAddress}`);

            // 2. Lock Resolver's assets on Sui
            console.log("[2/4] Locking resolver's assets on Sui...");
            const suiTxResponse = await this.createSuiEscrow(order);
            const createdObject = suiTxResponse.effects?.created?.[0]?.reference;
            if (!createdObject) {
                throw new Error("Sui escrow object not created.");
            }
            const suiHtlcObjectId = createdObject.objectId;
            console.log(`✅ Resolver's SUI locked in HTLC object: ${suiHtlcObjectId}`);
            console.log(`   View transaction: https://suiscan.xyz/testnet/tx/${suiTxResponse.digest}`);

            // == PHASE 2: SECRET REVEAL & WITHDRAWAL (Relayer + Resolver Job) ==

            // 3. Relayer simulation: The relayer would monitor both chains.
            // Seeing both escrows are funded, it releases the secret to the resolver.
            // Our bot already knows the secret, so we proceed.
            console.log("[3/4] Relayer confirms both locks. Proceeding to withdrawal.");

            // 4. Withdraw from both chains
            console.log("[4/4] Withdrawing from both chains...");
            
            // Withdraw from Sui (sends funds to the user)
            const suiWithdrawTx = await this.withdrawFromSui(suiHtlcObjectId, order.secret);
            console.log(`✅ Withdrew from Sui, funds sent to user.`);
            console.log(`   View transaction: https://suiscan.xyz/testnet/tx/${suiWithdrawTx.digest}`);

            // Withdraw from Ethereum (sends funds to the resolver)
            // This is simulated as we don't have the real contract instance.
            console.log(`✅ Simulating withdrawal from Ethereum escrow ${mockEthEscrowAddress}...`);
            
            console.log("\n🎉 Cross-chain swap complete!");

        } catch (error) {
            console.error("❌ Swap failed:", error);
        }
    }

    /**
     * Creates the HTLC object on Sui by locking the resolver's funds.
     */
    private async createSuiEscrow(order: any): Promise<any> {
        const txb = new TransactionBlock();

        // Get a coin for the resolver to lock
        const [coinToLock] = txb.splitCoins(txb.gas, [txb.pure(order.suiAmount)]);

        // Build the moveCall arguments
        txb.moveCall({
            target: `${CONFIG.SUI_PACKAGE_ID}::htlc::create`,
            typeArguments: [CONFIG.SUI_COIN_TYPE_TO_PROVIDE],
            arguments: [
                txb.pure(Array.from(fromHEX(order.hashlock)), 'vector<u8>'),
                txb.pure(order.timelock, 'u64'),
                txb.pure(order.userSuiAddress, 'address'),
                coinToLock,
            ],
        });

        return this.suiClient.signAndExecuteTransactionBlock({
            signer: this.suiKeypair,
            transactionBlock: txb,
            options: { showEffects: true },
        });
    }

    /**
     * Withdraws from the HTLC on Sui using the secret.
     */
    private async withdrawFromSui(htlcObjectId: string, secret: string): Promise<any> {
        const txb = new TransactionBlock();

        txb.moveCall({
            target: `${CONFIG.SUI_PACKAGE_ID}::htlc::withdraw`,
            typeArguments: [CONFIG.SUI_COIN_TYPE_TO_PROVIDE],
            arguments: [
                txb.object(htlcObjectId),
                txb.pure(Array.from(fromHEX(secret)), 'vector<u8>'),
                txb.object('0x6'), // The shared Clock object
            ],
        });

        return this.suiClient.signAndExecuteTransactionBlock({
            signer: this.suiKeypair,
            transactionBlock: txb,
            options: { showEffects: true },
        });
    }
}


// --- Main Execution ---
const bot = new ResolverBot();
bot.run().catch(console.error);