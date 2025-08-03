/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/pages/Fusion.jsx */
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Card from "../components/Card";
import Button from "../components/Button";

function Fusion() {
  return (
    <div className="relative min-h-screen pt-20 bg-gradient-to-b from-[#0d0220] to-[#38055a] text-white overflow-hidden select-none">
      <Navbar />
      
      {/* Fixed Spline background */}
      <div className="fixed inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-20 pointer-events-none select-none">
        <Spline 
          scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        />
      </div>

      <div className="relative z-10 px-6 py-8 select-none">
        <div className="mt-24 text-center">
          <h1 className="text-6xl animate-fade-up mb-4 font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent select-none">
            FUSION +
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-8 rounded-full"></div>
          <p className="mt-4 text-xl text-gray-300 select-none">
            Participate In Dutch Auctions For Cross Chain Swaps
          </p>
          <p className="mt-4 text-sm text-gray-400 select-none">
            Choose Your Role Below To Get Started
          </p>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          {/* Enhanced Maker Card */}
          <Card className="px-8 animate-bounce-once py-8 text-center w-80 group hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3 select-none">Maker</h2>
            <p className="text-gray-400 mb-6 leading-relaxed select-none">
              Create and auction your cross-chain swaps with optimal pricing discovery
            </p>
            <Button variant="dark" className="w-full group-hover:bg-white group-hover:text-black">
              <Link to="/fusion/maker" className="flex items-center justify-center space-x-2" draggable={false}>
                <span>Create Order</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </Card>

          {/* Enhanced Resolver Card */}
          <Card className="px-8 py-8 animate-bounce-once text-center w-80 group hover:scale-105 transition-all duration-300">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-3 select-none">Resolver</h2>
            <p className="text-gray-400 mb-6 leading-relaxed select-none">
              Fill orders and earn profits by providing cross-chain liquidity solutions
            </p>
            <Button variant="dark" className="w-full group-hover:bg-white group-hover:text-black">
              <Link to="/fusion/resolver" className="flex items-center justify-center space-x-2" draggable={false}>
                <span>Browse Orders</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </Button>
          </Card>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card glass className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2 text-purple-300 select-none">How It Works</h3>
            <p className="text-gray-400 text-sm leading-relaxed select-none">
              Fusion+ uses Dutch auction mechanisms to discover optimal prices for cross-chain swaps. 
              Makers create orders that start at a premium and gradually decrease in price until a resolver fills them.
            </p>
          </Card>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Fusion;