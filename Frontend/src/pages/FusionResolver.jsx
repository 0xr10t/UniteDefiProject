/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/pages/FusionResolver.jsx */
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spline from "@splinetool/react-spline";
import Card from "../components/Card";
import Button from "../components/Button";

function Resolver() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      from: "ETH",
      to: "USDC", 
      amount: "1.5",
      minReturn: "2000",
      profit: "$38",
      chain: "Ethereum → Polygon"
    },
    {
      from: "ETH",
      to: "DAI",
      amount: "1.2", 
      minReturn: "2200",
      profit: "$19",
      chain: "Ethereum → Arbitrum"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-gradient-to-br from-[#0f051d] to-[#1a0b30] text-white font-sans select-none overflow-hidden">
      <Navbar />
      
      {/* Fixed Spline background */}
      <div className="fixed inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-10 pointer-events-none select-none">
        <Spline
          scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode"
          style={{ pointerEvents: "none", userSelect: "none" }}
        />
      </div>

      <main className="relative z-10 flex-grow px-6 sm:px-10 md:px-16 lg:px-32 py-10 select-none">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent select-none">
            Resolver Dashboard
          </h1>
          <p className="text-gray-300 text-lg select-none">
            Browse and fill profitable cross-chain orders
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced Orders Table */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white select-none flex items-center space-x-2">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Available Orders</span>
              </h2>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-400 select-none">Live</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-left select-none">
                <thead className="text-gray-300 border-b border-white/10">
                  <tr>
                    <th className="py-4 px-6 font-semibold select-none">Route</th>
                    <th className="py-4 px-6 font-semibold select-none">Amount</th>
                    <th className="py-4 px-6 font-semibold select-none">Min Return</th>
                    <th className="py-4 px-6 font-semibold select-none">Profit Est</th>
                    <th className="py-4 px-6 font-semibold select-none">Action</th>
                  </tr>
                </thead>
                <tbody className="text-white divide-y divide-white/5">
                  {orders.map((order, index) => (
                    <tr 
                      key={index}
                      className="hover:bg-white/5 transition-all duration-200 select-none group"
                    >
                      <td className="py-4 px-6 select-none">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{order.from}</span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            <span className="font-medium">{order.to}</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">{order.chain}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 select-none">
                        <span className="font-mono font-medium">{order.amount}</span>
                      </td>
                      <td className="py-4 px-6 select-none">
                        <span className="font-mono">{order.minReturn}</span>
                      </td>
                      <td className="py-4 px-6 text-green-400 font-semibold select-none">
                        + {order.profit}
                      </td>
                      <td className="py-4 px-6 select-none">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="group-hover:border-purple-400 group-hover:bg-purple-400 group-hover:text-white"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Fill Order
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Enhanced AI Recommendation Box */}
        <Card glass className="p-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-purple-300 select-none">AI Optimization</h3>
          </div>
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
            <p className="text-sm text-gray-300 select-none">
              <span className="font-medium text-purple-300">Recommended Strategy:</span> 
              <span className="ml-2">Base or Mantle chains showing highest profitability</span>
            </p>
            <p className="text-sm text-gray-300 mt-2 select-none">
              <span className="font-medium text-blue-300">Average Return:</span>
              <span className="ml-2 text-green-400 font-semibold">3,060 USDC</span>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export default Resolver;