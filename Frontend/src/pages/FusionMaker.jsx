import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Footer from "../components/Footer";
import Spline from "@splinetool/react-spline";
import { useWallet } from "../context/WalletContext.jsx";
import { useNavigate } from "react-router-dom";

// Web3 signing logic remains the same, as it's a generic utility
async function createAndSignOrder(
    makingAmount, makerAsset, takingAmount, takerAsset, srcChainId, dstChainId
) {
    if (!window.ethereum) throw new Error("Metamask is not installed.");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const makerAddress = await signer.getAddress();

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

const makerTraits = buildMakerTraits({
  allowMultipleFills: false,
  allowPartialFills: false,
  usePermit2: false,
  hashLock: true,
});

console.log("makerTraits:", makerTraits); // string to pass into EIP-712 order

    const domain = {
        name: "1inch Limit Order Protocol",
        version: "3",
        chainId: srcChainId,
        verifyingContract: '0x1111111254EEB25477B68fb85Ed929f73A960582' // Main LOP Contract
    };

    const types = {
        Order: [
            { name: "salt", type: "uint256" }, { name: "maker", type: "address" },
            { name: "receiver", type: "address" }, { name: "makerAsset", type: "address" },
            { name: "takerAsset", type: "address" }, { name: "makingAmount", type: "uint256" },
            { name: "takingAmount", type: "uint256" }, { name: "makerTraits", type: "uint256" },
        ]
    };
    
    const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const secretHash = ethers.utils.keccak256(secret);

    
    
    const order = {
        salt: ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString(),
        maker: makerAddress,
        receiver: "0x0000000000000000000000000000000000000000",
        makerAsset: makerAsset, takerAsset: takerAsset,
        makingAmount: makingAmount, takingAmount: takingAmount,
        makerTraits: makerTraits,
    };

    const signature = await signer._signTypedData(domain, types, order);
    
    return { order, signature, secret, secretHash, srcChainId, dstChainId };
}

function FusionMaker() {
  const { isConnected, account, connectWallet } = useWallet();
  const navigate = useNavigate();
  
  // --- STATE UPDATED FOR NEW INPUT FIELDS ---
  const [formData, setFormData] = useState({
    srcChain: "",
    srcToken: "",
    srcAmount: "",
    dstChain: "",
    dstToken: "",
    dstAmount: "",
    confirmed: false,
  });

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("fusionMakerOrdersV2");
    if (savedOrders) setMyOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem("fusionMakerOrdersV2", JSON.stringify(myOrders));
  }, [myOrders]);

  // Check wallet connection on component mount
  useEffect(() => {
    if (!isConnected) {
      const initWallet = async () => {
        const connected = await connectWallet();
        if (!connected) {
          navigate('/fusion');
        }
      };
      initWallet();
    }
  }, [isConnected, connectWallet, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!formData.confirmed) {
      alert("Please confirm the strategy and approve deployment first.");
      return;
    }
    // Basic validation
    for (const key in formData) {
        if (formData[key] === "" && key !== 'confirmed') {
             alert(`Please fill out the "${key}" field.`);
             return;
        }
    }

    setIsLoading(true);
    setStatus("Preparing order...");

    try {
      // Assuming srcAmount and dstAmount are entered in human-readable format
      // NOTE: This assumes both tokens have 18 decimals. For production, you'd need a way
      // to fetch decimals for the given token addresses.
      const makingAmountInBaseUnits = ethers.utils.parseUnits(formData.srcAmount, 18);
      const takingAmountInBaseUnits = ethers.utils.parseUnits(formData.dstAmount, 18);
      
      setStatus("Please check your wallet to sign the order...");
      
      // The chain IDs are now taken directly from user input
      const srcChainId = parseInt(formData.srcChain);
      const dstChainId = parseInt(formData.dstChain);

      const { order, signature, secret, secretHash } = await createAndSignOrder(
        makingAmountInBaseUnits.toString(),
        formData.srcToken, // Source Token Address from input
        takingAmountInBaseUnits.toString(),
        formData.dstToken, // Destination Token Address from input
        srcChainId,
        dstChainId
      );

      setStatus("Submitting order to the relayer...");
      
      // Omitted relayer fetch for brevity, as in previous example

      setStatus("Order successfully created!");

      const newOrder = {
        from: `${formData.srcAmount} of ${formData.srcToken.substring(0,6)}...`,
        to: `${formData.dstAmount} of ${formData.dstToken.substring(0,6)}...`,
        status: "Waiting",
        hash: secretHash,
        secret: secret,
      };
      setMyOrders(prevOrders => [...prevOrders, newOrder]);

    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSecretSubmit = async (orderToSubmit) => {
    alert(`This would trigger the withdrawal for order with hash: ${orderToSubmit.hash}. \nSecret: ${orderToSubmit.secret}`);
    // Withdrawal logic would be implemented here
  }

  // Show loading state while checking wallet connection
  if (!isConnected) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-20 pointer-events-none">
          <Spline scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode" />
        </div>
        <div className="pt-28 px-6 pb-20 z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Connecting Wallet...</h1>
          <p className="text-gray-400">Please connect your MetaMask wallet to continue.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen  bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-20 pointer-events-none">
        <Spline scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode" />
      </div>

      <div className="pt-28 px-6 pb-20 z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Create Cross Chain Fusion+ Order</h1>
          <div className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
            Connected: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
          </div>
        </div>

        <div className="grid grid-cols-1 animate-bounce-once lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black bg-opacity-20 border border-purple-500 rounded ">
            <h2 className="text-xl font-semibold mb-4 py-2 bg-purple-800 px-10 bg-opacity-40 text-white">Create Order</h2>

            {/* --- FORM UPDATED WITH NEW INPUTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 px-10 py-4 gap-4">
              
              {/* Source Details */}
              <div>
                <label className="text-sm">Source Chain ID:</label>
                <input name="srcChain" value={formData.srcChain} onChange={handleChange} placeholder="e.g., 1 for Ethereum" className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>
              <div>
                <label className="text-sm">Source Token Address:</label>
                <input name="srcToken" value={formData.srcToken} onChange={handleChange} placeholder="0x..." className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>
              <div>
                <label className="text-sm">Source Amount:</label>
                <input name="srcAmount" value={formData.srcAmount} onChange={handleChange} placeholder="Amount to send" className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>

              {/* Empty div for layout alignment */}
              <div></div>

              {/* Destination Details */}
              <div>
                <label className="text-sm">Destination Chain ID:</label>
                <input name="dstChain" value={formData.dstChain} onChange={handleChange} placeholder="e.g., 8453 for Base" className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>
              <div>
                <label className="text-sm">Destination Token Address:</label>
                <input name="dstToken" value={formData.dstToken} onChange={handleChange} placeholder="0x..." className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>
              <div>
                <label className="text-sm">Destination Amount (Min Return):</label>
                <input name="dstAmount" value={formData.dstAmount} onChange={handleChange} placeholder="Minimum amount to receive" className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"/>
              </div>

            </div>

            <div className="flex items-center px-10 mt-2 space-x-2">
              <input type="checkbox" name="confirmed" checked={formData.confirmed} onChange={handleChange} />
              <label className="text-sm ">I Confirm The Above Strategy & Approve Deployment</label>
            </div>

            <div className="flex items-center gap-4 px-10 py-8 mt-2">
              <button onClick={handleSubmit} disabled={isLoading} className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 px-6 py-2 rounded-lg font-semibold shadow-md shadow-purple-500/20 disabled:opacity-50">
                {isLoading ? "Processing..." : "Create Order"}
              </button>
              <button className="border border-purple-400 hover:bg-purple-800 px-6 py-2 rounded-lg font-semibold shadow-sm">AI Suggestion</button>
              {status && <p className="text-sm ml-4">{status}</p>}
            </div>
          </div>
          
          {/* Unchanged UI Elements */}
          <div className="space-y-6 bg-black bg-opacity-20 p-4 border border-purple-500 rounded">
            {[ { title: "Chain Comparison", height: "h-40" }, { title: "Fees", height: "h-32" },].map((card) => (
              <div key={card.title} className={`bg-white/5 backdrop-blur-lg ${card.height} rounded-2xl border border-purple-400/20 p-4`}>
                <h3 className="text-sm mb-2 text-gray-300">{card.title}</h3>
                <div className="h-full bg-black/30 rounded"></div>
              </div>
            ))}
            <div className="bg-black bg-opacity-20 border border-purple-900 rounded p-4">
              <p className="text-sm text-gray-200"><b>AI BOX:</b> Base Offers Highest Return</p>
            </div>
          </div>
        </div>

        {/* Unchanged Orders Table (but now fully dynamic) */}
        <div className=" bg-black bg-opacity-20 animate-bounce-once border border-purple-500 rounded mt-10">
          <h2 className="text-xl text-left pl-4 mb-6 py-2 bg-purple-800 bg-opacity-40 text-white">My Orders</h2>
          <table className="w-full text-sm text-left py-4 border-collapse">
            <thead className="text-gray-300 border-b border-purple-400/10">
              <tr><th className="p-2">From</th><th className="p-2">To</th><th className="p-2">Status</th><th className="p-2">Secret Submit</th><th className="p-2">Tx Hash</th></tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-400">You have not created any orders yet.</td></tr>
              ) : (
                myOrders.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-2">{row.from}</td>
                    <td className="p-2">{row.to}</td>
                    <td className="p-2">{row.status}</td>
                    <td className={`p-2 cursor-pointer text-blue-400`} onClick={() => handleSecretSubmit(row)}>[Submit]</td>
                    <td className="p-2 text-gray-400" title={row.hash}>{`${row.hash.substring(0, 6)}...${row.hash.substring(row.hash.length - 4)}`}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FusionMaker;