import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import { useWallet } from "../context/WalletContext.jsx";

function Fusion() {
  const { isConnected, connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();

  const handleMakerClick = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (connected) {
        navigate('/fusion/maker');
      }
    } else {
      navigate('/fusion/maker');
    }
  };

  const handleResolverClick = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (connected) {
        navigate('/fusion/resolver');
      }
    } else {
      navigate('/fusion/resolver');
    }
  };

  return (
    <div className="relative min-h-screen pt-20 bg-gradient-to-b from-[#0d0220] to-[#38055a] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-20 pointer-events-none">
        <Spline scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode" />
      </div>

      <div className="relative z-10 px-6 py-8">

        <div className="mt-24 text-center">
          <h1 className="text-5xl animate-fade-up mb-8 font-bold">FUSION +</h1>
          <p className="mt-4 text-lg text-gray-300">
            Participate In Dutch Auctions For Cross Chain Swaps
          </p>
          <p className="mt-4 text-sm text-gray-400">
            Choose Your Role Below To Get Started.
          </p>
          {!isConnected && (
            <p className="mt-4 text-sm text-yellow-400">
              ⚠️ Please connect your wallet to access Maker and Resolver features
            </p>
          )}
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="bg-[#623295] px-8 animate-bounce-once py-6 rounded-xl text-center w-72 backdrop-blur-sm bg-opacity-60">
            <h2 className="text-2xl font-semibold mb-2">Maker</h2>
            <p className="text-gray-400 mb-4">Create & Auction Your Swap</p>
            <button
              onClick={handleMakerClick}
              disabled={isConnecting}
              className="inline-flex items-center justify-center bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Create'}
              <span className="ml-2 text-lg">→</span>
            </button>
          </div>

          <div className="bg-[#623295] px-8 py-6 animate-bounce-once rounded-xl text-center w-72 backdrop-blur-sm bg-opacity-60">
            <h2 className="text-2xl font-semibold mb-2">Resolver</h2>
            <p className="text-gray-400 mb-4">Fill Orders For Profit</p>
            <button
              onClick={handleResolverClick}
              disabled={isConnecting}
              className="inline-flex items-center justify-center bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : 'Browse'}
              <span className="ml-2 text-lg">→</span>
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Fusion;
