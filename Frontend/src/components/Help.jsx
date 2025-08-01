import React from 'react';

function HelpOverlay({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-[#1f002b] text-white p-6 rounded-lg max-w-lg w-full relative shadow-2xl border border-purple-500">
        <button onClick={onClose} className="absolute top-3 right-3 text-lg font-bold text-purple-300">✕</button>
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <ul className="space-y-2 text-sm">
          <li><strong>How to create a limit order?</strong> Fill out token pairs, amount, and price.</li>
          <li><strong>How to cancel?</strong> Go to ‘My Orders’ and click on ‘Cancel’.</li>
          <li><strong>Who fills my order?</strong> Resolvers that find your price profitable.</li>
          <li><strong>Fees?</strong> Based on chain congestion and auction config.</li>
        </ul>
      </div>
    </div>
  );
}

export default HelpOverlay;
