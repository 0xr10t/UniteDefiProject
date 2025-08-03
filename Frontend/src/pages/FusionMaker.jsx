/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/pages/FusionMaker.jsx */
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";

function FusionMaker() {
  const [formData, setFormData] = useState({
    fromToken: 'ETH',
    toToken: 'USDC',
    fromChain: 'ethereum',
    toChain: 'polygon',
    amount: '',
    minReturn: '',
    duration: '1'
  });

  const [activeOrders, setActiveOrders] = useState([
    {
      id: "0x1a2b3c4d",
      from: "2.5 ETH",
      to: "4,850 USDC", 
      route: "Ethereum → Polygon",
      status: "Active",
      currentPrice: "4,720 USDC",
      timeLeft: "2h 15m",
      progress: 65
    },
    {
      id: "0x5e6f7g8h", 
      from: "1000 MATIC",
      to: "850 USDC",
      route: "Polygon → Arbitrum", 
      status: "Filled",
      currentPrice: "850 USDC",
      timeLeft: "Completed",
      progress: 100
    }
  ]);

  const chains = [
    { id: 'ethereum', name: 'Ethereum', color: 'bg-blue-500' },
    { id: 'polygon', name: 'Polygon', color: 'bg-purple-500' },
    { id: 'arbitrum', name: 'Arbitrum', color: 'bg-cyan-500' },
    { id: 'optimism', name: 'Optimism', color: 'bg-red-500' }
  ];

  const tokens = ['ETH', 'USDC', 'USDT', 'DAI', 'WBTC', 'MATIC'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateOrder = () => {
    console.log('Creating order:', formData);
    // Add order creation logic here
  };

  const StatusIndicator = ({ status }) => {
    const colors = {
      'Active': 'bg-green-500 text-green-100',
      'Filled': 'bg-blue-500 text-blue-100', 
      'Cancelled': 'bg-red-500 text-red-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0118] text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Create Order
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Set up your cross-chain swap with Dutch auction pricing for optimal execution
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400/50 to-blue-400/50 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Create Order Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">New Cross-Chain Order</h2>
                </div>

                <div className="space-y-6">
                  
                  {/* From Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">From Chain</label>
                      <select 
                        value={formData.fromChain}
                        onChange={(e) => handleInputChange('fromChain', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      >
                        {chains.map(chain => (
                          <option key={chain.id} value={chain.id} className="bg-gray-900">
                            {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                      <select
                        value={formData.fromToken}
                        onChange={(e) => handleInputChange('fromToken', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      >
                        {tokens.map(token => (
                          <option key={token} value={token} className="bg-gray-900">
                            {token}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        {formData.fromToken}
                      </div>
                    </div>
                  </div>

                  {/* Swap Arrow */}
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center cursor-pointer transition-colors group">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </div>

                  {/* To Section */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">To Chain</label>
                      <select
                        value={formData.toChain}
                        onChange={(e) => handleInputChange('toChain', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      >
                        {chains.map(chain => (
                          <option key={chain.id} value={chain.id} className="bg-gray-900">
                            {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                      <select
                        value={formData.toToken}
                        onChange={(e) => handleInputChange('toToken', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      >
                        {tokens.map(token => (
                          <option key={token} value={token} className="bg-gray-900">
                            {token}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Return</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.minReturn}
                        onChange={(e) => handleInputChange('minReturn', e.target.value)}
                        placeholder="0.0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">
                        {formData.toToken}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Auction Duration</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-colors"
                    >
                      <option value="0.5" className="bg-gray-900">30 minutes</option>
                      <option value="1" className="bg-gray-900">1 hour</option>  
                      <option value="2" className="bg-gray-900">2 hours</option>
                      <option value="6" className="bg-gray-900">6 hours</option>
                      <option value="24" className="bg-gray-900">24 hours</option>
                    </select>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full py-4 text-lg"
                    onClick={handleCreateOrder}
                  >
                    Create Auction Order
                  </Button>
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              
              {/* Order Preview */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Order Preview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">You're selling:</span>
                    <span className="text-white font-medium">
                      {formData.amount || '0'} {formData.fromToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minimum receive:</span>
                    <span className="text-white font-medium">
                      {formData.minReturn || '0'} {formData.toToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white font-medium">{formData.duration}h</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Route:</span>
                      <span className="text-white font-medium">
                        {chains.find(c => c.id === formData.fromChain)?.name} → {chains.find(c => c.id === formData.toChain)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Market Info */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Market Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Rate:</span>
                    <span className="text-green-400 font-medium">1 ETH = 2,450 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change:</span>
                    <span className="text-green-400 font-medium">+2.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Fee Est:</span>
                    <span className="text-white font-medium">~$12</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Active Orders */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-white">Your Active Orders</h2>
            <div className="grid gap-4">
              {activeOrders.map(order => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <code className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300">
                          {order.id}
                        </code>
                        <StatusIndicator status={order.status} />
                      </div>
                      <div className="flex items-center space-x-2 text-lg font-medium">
                        <span>{order.from}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span>{order.to}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{order.route}</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Current Price</div>
                        <div className="font-medium text-white">{order.currentPrice}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-400">Time Left</div>
                        <div className="font-medium text-white">{order.timeLeft}</div>
                      </div>
                      {order.status === 'Active' && (
                        <Button size="sm" variant="outline">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {order.status === 'Active' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Auction Progress</span>
                        <span className="text-gray-400">{order.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FusionMaker;