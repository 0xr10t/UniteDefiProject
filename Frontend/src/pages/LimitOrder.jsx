/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/pages/LimitOrders.jsx */
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";

function LimitOrders() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeOrders = [
    {
      id: "0x1a2b3c",
      pair: "ETH/USDC",
      type: "Buy",
      amount: "1.5 ETH",
      price: "2,450 USDC",
      filled: "0%",
      status: "Active",
      created: "2h ago"
    },
    {
      id: "0x4d5e6f",
      pair: "BTC/USDT",
      type: "Sell", 
      amount: "0.1 BTC",
      price: "45,000 USDT",
      filled: "25%",
      status: "Partial",
      created: "4h ago"
    }
  ];

  const orderHistory = [
    {
      id: "0x7g8h9i",
      pair: "MATIC/USDC",
      type: "Buy",
      amount: "1000 MATIC",
      price: "0.85 USDC",
      filled: "100%",
      status: "Completed",
      created: "1d ago"
    }
  ];

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium transition-all duration-200 relative ${
        active 
          ? 'text-white' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"></div>
      )}
    </button>
  );

  const StatusBadge = ({ status }) => {
    const colors = {
      'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Partial': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Completed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[status] || colors.Active}`}>
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
              Limit Orders
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Set precise entry and exit points for your trades with advanced limit order functionality
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400/50 to-blue-400/50 mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex border border-white/10 rounded-lg bg-black/20 backdrop-blur-sm">
              <TabButton
                id="active"
                label="Active Orders"
                active={activeTab === 'active'}
                onClick={setActiveTab}
              />
              <TabButton
                id="history"
                label="Order History"
                active={activeTab === 'history'}
                onClick={setActiveTab}
              />
            </div>
            
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Order</span>
            </Button>
          </div>

          {/* Orders Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Pair</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Filled</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(activeTab === 'active' ? activeOrders : orderHistory).map((order, index) => (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors group">
                      <td className="py-4 px-6">
                        <code className="text-sm text-gray-300 bg-white/5 px-2 py-1 rounded font-mono">
                          {order.id}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-white">{order.pair}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.type === 'Buy' 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm text-gray-200">{order.amount}</td>
                      <td className="py-4 px-6 font-mono text-sm text-gray-200">{order.price}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300"
                              style={{ width: order.filled }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{order.filled}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          {order.status === 'Active' || order.status === 'Partial' ? (
                            <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Cancel
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Empty State */}
          {(activeTab === 'active' ? activeOrders : orderHistory).length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">Create your first limit order to get started</p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Order
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LimitOrders;