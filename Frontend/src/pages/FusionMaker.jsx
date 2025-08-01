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
    <div className="relative min-h-screen bg-gradient-to-b from-[#0d0220] to-[#19002a] text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-50">
        
      </div>

      <div className="pt-28 px-6 pb-20 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Create Cross Chain Fusion+ Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-black bg-opacity-20 border border-purple-500 rounded ">
            <h2 className="text-xl font-semibold mb-4 py-2 bg-purple-800 px-10 bg-opacity-40 text-white">Create Order</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 px-10 py-4 gap-4">
              {[
                { label: "From", name: "from", options: ["ETH", "USDC"] },
                { label: "To", name: "to", options: ["DAI", "USDC"] },
                {
                  label: "Destination Chain",
                  name: "chain",
                  options: ["Base", "Optimism"],
                },
                {
                  label: "Auction Duration",
                  name: "duration",
                  options: ["1h", "6h", "24h"],
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm">{field.label}:</label>
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div>
                <label className="text-sm">Amount:</label>
                <input
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Spend Amount"
                  className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm">Min Return:</label>
                <input
                  name="minReturn"
                  value={formData.minReturn}
                  onChange={handleChange}
                  placeholder="Enter Min Return"
                  className="w-full p-2 mt-1 bg-black/40 backdrop-blur-md border border-purple-500/30 text-white rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center px-10 mt-2 space-x-2">
              <input
                type="checkbox"
                name="confirmed"
                checked={formData.confirmed}
                onChange={handleChange}
              />
              <label className="text-sm ">
                I Confirm The Above Strategy & Approve Deployment
              </label>
            </div>

            <div className="flex gap-4 px-10 py-8 mt-2">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 px-6 py-2 rounded-lg font-semibold shadow-md shadow-purple-500/20"
              >
                Create Order
              </button>
              <button className="border border-purple-400 hover:bg-purple-800 px-6 py-2 rounded-lg font-semibold shadow-sm">
                AI Suggestion
              </button>
            </div>
          </div>

          <div className="space-y-6 bg-black bg-opacity-20 p-4 border border-purple-500 rounded">
            {[
              { title: "Chain Comparison", height: "h-40" },
              { title: "Fees", height: "h-32" },
            ].map((card) => (
              <div
                key={card.title}
                className={`bg-white/5 backdrop-blur-lg ${card.height} rounded-2xl border border-purple-400/20 p-4`}
              >
                <h3 className="text-sm mb-2 text-gray-300">{card.title}</h3>
                <div className="h-full bg-black/30 rounded"></div>
              </div>
            ))}

            <div className="bg-black bg-opacity-20 border border-purple-900 rounded p-4">
              <p className="text-sm text-gray-200">
                <b>AI BOX:</b> Base Offers Highest Return
              </p>
            </div>
          </div>
        </div>

        <div className=" bg-black bg-opacity-20 border border-purple-500 rounded mt-10">
          <h2 className="text-xl text-left pl-4 mb-6 py-2 bg-purple-800 bg-opacity-40 text-white">My Orders</h2>
          <table className="w-full text-sm text-left py-4 border-collapse">
            <thead className="text-gray-300 border-b border-purple-400/10">
              <tr>
                <th className="p-2">From</th>
                <th className="p-2">To</th>
                <th className="p-2">Status</th>
                <th className="p-2">Secret Submit</th>
                <th className="p-2">Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  from: "ETH",
                  to: "USDC",
                  status: "Waiting",
                  submit: "[Submit]",
                  hash: "0xabc...def",
                  color: "text-blue-400",
                },
                {
                  from: "ETH",
                  to: "DAI",
                  status: "Filled",
                  submit: "Check",
                  hash: "0x123...456",
                  color: "text-green-400",
                },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-2">{row.from}</td>
                  <td className="p-2">{row.to}</td>
                  <td className="p-2">{row.status}</td>
                  <td className={`p-2 cursor-pointer ${row.color}`}>
                    {row.submit}
                  </td>
                  <td className="p-2 text-gray-400">{row.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
      
    </div>
  );
}

export default FusionMaker;
