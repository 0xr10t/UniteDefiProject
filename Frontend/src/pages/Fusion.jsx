import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Fusion() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white px-6 py-8 relative overflow-hidden">

      <div className="mt-24 text-center">
        <h1 className="text-5xl font-bold">FUSION +</h1>
        <p className="mt-4 text-lg text-gray-300">
          Participate In Dutch Auctions For Cross Chain Swaps
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Choose Your Role Below To Get Started.
        </p>
      </div>

      
      <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8">
        
        <div className="bg-[#1a0e3b] px-8 py-6 rounded-xl text-center w-72">
          <h2 className="text-2xl font-semibold mb-2">Maker</h2>
          <p className="text-gray-400 mb-4">Create & Auction Your Swap</p>
          <Link
            to="/fusion/maker"
            className="inline-flex items-center justify-center bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-black transition"
          >
            Create
            <span className="ml-2 text-lg">→</span>
          </Link>
        </div>

        <div className="bg-[#1a0e3b] px-8 py-6 rounded-xl text-center w-72">
          <h2 className="text-2xl font-semibold mb-2">Resolver</h2>
          <p className="text-gray-400 mb-4">Fill Orders For Profit</p>
          <Link
            to="/fusion/resolver"
            className="inline-flex items-center justify-center bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-white hover:text-black transition"
          >
            Browse
            <span className="ml-2 text-lg">→</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Fusion;
