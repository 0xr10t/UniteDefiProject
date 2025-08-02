import React, { useState } from 'react';
import Footer from '../components/Footer';
import Spline from '@splinetool/react-spline';

const initialOrders = [
  { id: 1, from: 'ETH', to: 'USDC', amount: '1.5', status: 'Open' },
  { id: 2, from: 'BTC', to: 'DAI', amount: '0.8', status: 'Filled' },
  { id: 3, from: 'ARB', to: 'USDT', amount: '2.1', status: 'Cancelled' },
];

function LimitOrders() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);

  const filtered = orders.filter(order =>
    `${order.from}${order.to}${order.amount}${order.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br pt-20 from-[#0f051d] to-[#1a0b30] text-white overflow-hidden">
      <div className="absolute inset-0 z-0 transform scale-[1.5] -translate-y-32 opacity-20 pointer-events-none">
        <Spline scene="https://prod.spline.design/k48GCVc-BEkzA-pP/scene.splinecode" />
      </div>
      
      <div className="px-6 py-10 max-w-5xl z-20 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Limit Orders</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full p-2 rounded bg-black bg-opacity-20 border border-purple-400 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left bg-black bg-opacity-20 border border-purple-500 rounded">
          <thead className="bg-purple-600 bg-opacity-40 text-white">
            <tr>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-purple-800 hover:bg-opacity-30 transition">
                <td className="p-3">{order.from}</td>
                <td className="p-3">{order.to}</td>
                <td className="p-3">{order.amount}</td>
                <td className="p-3">{order.status}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-3 text-center" colSpan="4">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

export default LimitOrders;
