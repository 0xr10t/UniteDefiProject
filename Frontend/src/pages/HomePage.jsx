/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/pages/HomePage.jsx */
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spline from "@splinetool/react-spline";
import Button from "../components/Button";

function Home() {
  const features = [
    {
      icon: "🔄",
      title: "Cross-Chain Swaps",
      description: "Seamlessly swap tokens across multiple blockchains with optimal routing"
    },
    {
      icon: "🎯",
      title: "Dutch Auctions",
      description: "Participate in efficient price discovery through automated auctions"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Execute trades in seconds with minimal slippage and maximum efficiency"
    }
  ];

  const stats = [
    { value: "$1.2B+", label: "Total Volume Traded" },
    { value: "50K+", label: "Active Users" },
    { value: "99.9%", label: "Platform Uptime" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0d0220] via-[#19002a] to-[#0d0220] text-white overflow-hidden select-none">
      <Navbar />
      
      {/* Enhanced Spline Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none select-none">
        <Spline 
          scene="https://prod.spline.design/iCatMd9WUYbwKsJx/scene.splinecode"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 select-none">
              The Future of
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent block mt-2">
                Cross-Chain Trading
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed select-none">
              Experience seamless cross-chain swaps powered by Dutch auction mechanisms. 
              Trade smarter with optimal routing and minimal slippage across multiple blockchains.
            </p>
          </div>

          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 justify-center items-center mb-16" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="min-w-[200px] group">
              <Link to="/fusion" className="flex items-center space-x-2" draggable={false}>
                <span>Start Trading</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="min-w-[200px]">
              <span>Learn More</span>
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 animate-fade-up select-none"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 select-none">Why Choose UniteDefi?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto select-none">
              Built for the next generation of DeFi trading with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 select-none"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;