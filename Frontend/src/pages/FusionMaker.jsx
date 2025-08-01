import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FusionMaker() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "",
    minReturn: "",
    chain: "",
    duration: "",
    confirmed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (formData.confirmed) {
      alert("Order created!");
    } else {
      alert("Please confirm the strategy.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white relative overflow-hidden">
      <Navbar onHelpClick={() => {}} />

      <div className="max-w-7xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-center mb-12">Maker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-[#1a0e3b] p-6 rounded-xl border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Create Order</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">From:</label>
                <select
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                >
                  <option value="">Token</option>
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>

              <div>
                <label className="text-sm">To:</label>
                <select
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                >
                  <option value="">Token</option>
                  <option value="DAI">DAI</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Amount:</label>
                <input
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Spend Amount"
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                />
              </div>

              <div>
                <label className="text-sm">Min Return:</label>
                <input
                  name="minReturn"
                  value={formData.minReturn}
                  onChange={handleChange}
                  placeholder="Enter Min Return"
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                />
              </div>

              <div>
                <label className="text-sm">Destination Chain:</label>
                <select
                  name="chain"
                  value={formData.chain}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                >
                  <option value="">Select</option>
                  <option value="Base">Base</option>
                  <option value="Optimism">Optimism</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Auction Duration:</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 bg-black border border-white/10 rounded"
                >
                  <option value="">Duration</option>
                  <option value="1h">1 Hour</option>
                  <option value="6h">6 Hours</option>
                  <option value="24h">24 Hours</option>
                </select>
              </div>
            </div>

            <div className="flex items-center mt-4 space-x-2">
              <input
                type="checkbox"
                name="confirmed"
                checked={formData.confirmed}
                onChange={handleChange}
              />
              <label className="text-sm">
                I Confirm The Above Strategy & Approve Deployment
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-semibold"
              >
                Create Order
              </button>
              <button className="border border-purple-500 hover:bg-purple-800 px-6 py-2 rounded font-semibold">
                AI Suggestion
              </button>
            </div>
          </div>

          
          <div className="space-y-6">
            <div className="bg-[#1a0e3b] h-40 rounded-xl border border-white/10 p-4">
              <h3 className="text-sm mb-2 text-gray-300">Chain Comparison</h3>
              <div className="h-full bg-black rounded"></div>
            </div>

            <div className="bg-[#1a0e3b] h-32 rounded-xl border border-white/10 p-4">
              <h3 className="text-sm mb-2 text-gray-300">Fees</h3>
              <div className="h-full bg-black rounded"></div>
            </div>

            <div className="bg-[#1a0e3b] p-4 rounded-xl border border-white/10">
              <p className="text-sm text-gray-200">
                <b>AI BOX:</b> Base Offers Highest Return
              </p>
            </div>
          </div>
        </div>

        
        <div className="mt-16 bg-[#1a0e3b] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">My Orders</h2>
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-gray-300 border-b border-white/10">
              <tr>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Secret Submit</th>
                <th className="p-2">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="p-2">ETH</td>
                <td className="p-2">USDC</td>
                <td className="p-2">Waiting</td>
                <td className="p-2 text-blue-400 cursor-pointer">[Submit]</td>
                <td className="p-2 text-gray-400">0xabc...def</td>
              </tr>
              <tr>
                <td className="p-2">ETH</td>
                <td className="p-2">DAI</td>
                <td className="p-2">Filled</td>
                <td className="p-2 text-green-400">Check</td>
                <td className="p-2 text-gray-400">0x123...456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FusionMaker;
