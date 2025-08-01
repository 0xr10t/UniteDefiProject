import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white px-6 py-8 relative overflow-hidden">
<div className="absolute bottom-0 left-[10px] md:left-[1350px] transform translate-x-[-20%] animate-float translate-y-[40%] opacity-70 z-[1]">
                <div className="relative">
                    <div
                        className="w-80 h-80 rounded-full relative"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                            boxShadow: '0 0 100px rgba(168, 85, 247, 0.8), 0 0 200px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                            animation: 'sphereGlow 4s ease-in-out infinite alternate'
                        }}
                    >
                        <div
                            className="absolute top-8 left-8 w-16 h-16 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                                filter: 'blur(4px)'
                            }}
                        />
                        <div
                            className="absolute top-12 left-12 w-8 h-8 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 80%)',
                                filter: 'blur(2px)'
                            }}
                        />
                    </div>
                    <div
                        className="absolute inset-0 w-80 h-80 rounded-full animate-pulse"
                        style={{
                            background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                            animation: 'pulseGlow 3s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="absolute inset-0 w-96 h-96 rounded-full -translate-x-8 -translate-y-8"
                        style={{
                            background: 'radial-gradient(circle, transparent 0%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)',
                            animation: 'pulseGlow 5s ease-in-out infinite reverse'
                        }}
                    />
                </div>
            </div>

      <div className="mt-24 text-center">
        
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Smarter Cross Chain <br /> Swaps With AI
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          Get Optimised Swaps Across Chains, Guided By AI Agents.
        </p>
        
        <div className="mt-8 flex justify-center gap-4">
          <div className=" text-center">
            <Link
              to="/fusion/maker"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
            >
              Start Swapping
            </Link>
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-lg font-semibold border border-white/20">
            Learn More
          </button>
        </div>

        <div className="mt-20 text-sm text-gray-400 space-x-4 underline underline-offset-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms Of Service</a>
          <a href="#">Fees</a>
        </div>
      </div>
    </div>
  );
}

export default Home;
