import React from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";

function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white px-6 py-8 overflow-hidden">

      <div className="absolute inset-0 z-10 opacity-80 scale-[1.3] -translate-y-0">
        <Spline scene="https://prod.spline.design/iCatMd9WUYbwKsJx/scene.splinecode" />
      </div>

      <div className="mt-56 text-center relative gap-8 z-10">
        <h1 className="text-7xl md:text-6xl font-bold leading-tight drop-shadow-md">
          Smarter Cross Chain <br /> Swaps With AI
        </h1>
        <p className="mt-10 text-lg text-gray-300">
          Get Optimised Swaps Across Chains, Guided By AI Agents.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/fusion"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
          >
            Start Swapping
          </Link>
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
