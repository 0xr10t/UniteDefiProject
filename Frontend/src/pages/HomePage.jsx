import React from "react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white px-6 py-8 relative overflow-hidden">
      <Navbar onHelpClick={() => {}} />

      <div className="mt-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Smarter Cross Chain <br /> Swaps With AI
        </h1>
        <p className="mt-6 text-lg text-gray-300">
          Get Optimised Swaps Across Chains, Guided By AI Agents.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-lg font-semibold">
            Start Swapping
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md text-lg font-semibold border border-white/20">
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

export default Home ;
