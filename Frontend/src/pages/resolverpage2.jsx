// Filename: src/pages/ResolverDashboard.jsx

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { RELAYER_URL, RESOLVER_ADDRESSES, RESOLVER_ABI } from "../config";

const takerTraits = buildTakerTraits({
  argsHasTarget: true,
  argsInteractionLength: 32,
  argsExtensionLength: 0
});

function buildTakerTraits({ argsHasTarget = false, argsInteractionLength = 0, argsExtensionLength = 0 }) {
  let traits = 0n;
  if (argsHasTarget) traits |= 1n << 251n;
  traits |= BigInt(argsInteractionLength) << 200n; // because argsMem = abi.encodePacked(computed, args)` → first 20 bytes = target contract

//amount user is depositing
//from frontend it will come 

  traits |= BigInt(argsExtensionLength) << 224n;
  return traits.toString(); // to use in contracts
}
// Helper to format large numbers for display
function formatAmount(amount, decimals = 18) {
  try {
    return ethers.utils.formatUnits(amount, decimals);
  } catch {
    return "0.0";
  }
}

function ResolverDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Fetch pending orders from the relayer when the component loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setStatus("Fetching pending orders...");
        const response = await fetch(`http://localhost:5000/orders`);
        if (!response.ok) throw new Error("Failed to fetch orders from relayer.");
        
        const data = await response.json();
        setOrders(data);
        setStatus("");
      } catch (error) {
        console.error(error);
        setStatus(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleExecuteSwap = async (orderToExecute) => {
    setStatus("Starting swap execution...");
    setIsLoading(true);

    try {
      if (!window.ethereum) throw new Error("Metamask is not installed.");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // --- 1. Connect to Resolver contract on SOURCE chain ---
      const srcResolverAddress = RESOLVER_ADDRESSES[orderToExecute.srcChainId];
      if (!srcResolverAddress) throw new Error(`Resolver contract not configured for source chain ID ${orderToExecute.srcChainId}`);
      
      const network = await provider.getNetwork();
      if (network.chainId !== orderToExecute.srcChainId) {
        throw new Error(`Please connect your wallet to the source chain (ID: ${orderToExecute.srcChainId})`);
      }

      const resolverContractSrc = new ethers.Contract(srcResolverAddress, RESOLVER_ABI, signer);

      // --- 2. Prepare ALL parameters for deploySrc ---
      setStatus("Preparing source chain parameters...");
      
      const takerAddress = await signer.getAddress();
      const { order, signature, secretHash } = orderToExecute;

      // Prepare Timelocks
      const now = Math.floor(Date.now() / 1000);
      const timelocks = {
        srcWithdrawal: 900, // 15 mins
        srcPublicWithdrawal: 1200, // 20 mins
        srcCancellation: 1800, // 30 mins
        srcPublicCancellation: 2400, // 40 mins
        dstWithdrawal: 900,
        dstPublicWithdrawal: 1200,
        dstCancellation: 1800,
      };
      
      const encodedTimelocks = (
        (BigInt(now) << 224n) | (BigInt(timelocks.srcWithdrawal) << 192n) |
        (BigInt(timelocks.srcPublicWithdrawal) << 160n) | (BigInt(timelocks.srcCancellation) << 128n) |
        (BigInt(timelocks.srcPublicCancellation) << 96n) | (BigInt(timelocks.dstWithdrawal) << 64n) |
        (BigInt(timelocks.dstPublicWithdrawal) << 32n) | BigInt(timelocks.dstCancellation)
      ).toString();

      const safetyDeposit = ethers.utils.parseEther("0.0001"); // Example value

      // Prepare Immutables struct for Source Escrow
      const immutablesSrc = {
        orderHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("...recompute order hash...")), // It's safer to re-hash on client
        hashlock: secretHash,
        maker: order.maker,
        taker: takerAddress,
        token: order.makerAsset,
        amount: order.makingAmount,
        safetyDeposit: safetyDeposit,
        timelocks: encodedTimelocks,
        parameters: "0x",
      };

      // Prepare other params
      const { r, vs } = ethers.utils.splitSignature(signature);
      const takerTraits = buildTakerTraits();
      const argsForDeploySrc = secretHash; // As per contract logic

      // --- 3. Execute deploySrc Transaction ---
      setStatus("Please approve the deploySrc transaction in your wallet...");
      const txSrc = await resolverContractSrc.deploySrc(
        immutablesSrc, order, r, vs, order.makingAmount, takerTraits, argsForDeploySrc,
        { value: safetyDeposit }
      );
      await txSrc.wait();
      setStatus(`Source escrow deployed! Tx: ${txSrc.hash}`);
      
      // --- 4. Execute deployDst Transaction ---
      alert(`IMPORTANT: Please switch your wallet's network to the destination chain (ID: ${orderToExecute.dstChainId}) to complete the swap.`);
      // In a production app, you would use provider.send('wallet_switchEthereumChain', ...)
      // and wait for the network change before proceeding.
      
      // For this example, we assume the user switches manually.
      setStatus("Awaiting network switch to destination chain...");
      
      // We will need a new contract instance for the destination chain
      const dstResolverAddress = RESOLVER_ADDRESSES[orderToExecute.dstChainId];
      // const resolverContractDst = new ethers.Contract(dstResolverAddress, RESOLVER_ABI, signer);
      
      // const immutablesDst = { ...immutablesSrc, token: order.takerAsset, amount: order.takingAmount };
      // const srcCancellationTimestamp = now + timelocks.srcCancellation;
      
      // const txDst = await resolverContractDst.deployDst(immutablesDst, srcCancellationTimestamp, { value: safetyDeposit });
      // await txDst.wait();
      
      setStatus("Swap successfully executed! Monitoring for secret reveal...");
      setSelectedOrder(null); // Close modal on success

    } catch (error) {
      console.error(error);
      setStatus(`Execution failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Resolver Dashboard</h1>
        <p>Pending Cross-Chain Orders</p>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {isLoading && !selectedOrder && <p>{status || "Loading..."}</p>}
        {!isLoading && orders.length === 0 && <p>No pending orders found.</p>}

        <div style={styles.orderList}>
          {orders.map((order) => (
            <div key={order.secretHash} style={styles.orderCard} onClick={() => setSelectedOrder(order)}>
              <div style={styles.cardRow}>
                <span><strong>From Chain:</strong> {order.srcChainId}</span>
                <span><strong>To Chain:</strong> {order.dstChainId}</span>
              </div>
              <div style={styles.cardRow}>
                <span>Swap <strong>{formatAmount(order.order.makingAmount)}</strong> of Token <code style={styles.code}>{order.order.makerAsset.substring(0, 6)}...</code></span>
              </div>
              <div style={styles.cardRow}>
                <span>For <strong>{formatAmount(order.order.takingAmount)}</strong> of Token <code style={styles.code}>{order.order.takerAsset.substring(0, 6)}...</code></span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Execute Order</h2>
            <p><strong>Secret Hash:</strong> <code style={styles.code}>{selectedOrder.secretHash}</code></p>
            <p><strong>Maker:</strong> <code style={styles.code}>{selectedOrder.order.maker}</code></p>
            {/* You can display more details from the `selectedOrder` object here */}
            
            <div style={styles.buttonGroup}>
              <button style={styles.buttonExecute} onClick={() => handleExecuteSwap(selectedOrder)} disabled={isLoading}>
                {isLoading ? "Processing..." : "Execute Swap"}
              </button>
              <button style={styles.buttonCancel} onClick={() => setSelectedOrder(null)} disabled={isLoading}>
                Cancel
              </button>
            </div>
            {status && <p style={styles.statusText}>{status}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Basic Styles ---
const styles = {
  page: { fontFamily: 'sans-serif', backgroundColor: '#111', color: '#eee', minHeight: '100vh' },
  header: { textAlign: 'center', padding: '2rem', borderBottom: '1px solid #333' },
  main: { maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' },
  orderList: { display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' },
  orderCard: { border: '1px solid #444', borderRadius: '8px', padding: '1rem', cursor: 'pointer', backgroundColor: '#222', transition: 'transform 0.2s', ':hover': { transform: 'scale(1.02)' } },
  cardRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  code: { backgroundColor: '#333', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalContent: { backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', border: '1px solid #555' },
  buttonGroup: { marginTop: '2rem', display: 'flex', gap: '1rem' },
  buttonExecute: { flex: 1, padding: '0.8rem', border: 'none', borderRadius: '6px', backgroundColor: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer' },
  buttonCancel: { flex: 1, padding: '0.8rem', border: '1px solid #555', borderRadius: '6px', backgroundColor: '#333', color: 'white', fontSize: '1rem', cursor: 'pointer' },
  statusText: { marginTop: '1rem', color: '#00caff' },
};

export default ResolverDashboard;