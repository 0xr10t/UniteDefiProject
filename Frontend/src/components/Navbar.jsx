import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../context/WalletContext.jsx";

function Navbar({ onHelpClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isConnected, account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleWalletClick = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur border-b border-white/10 bg-black/20 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="text-xl font-bold">LOGO</div>

        <div className="space-x-6 hidden md:flex items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-purple-400 transition"
            >
              Fusion+
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full bg-black border border-white/10 rounded-md shadow-lg mt-2 min-w-[160px] z-50">
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    if (!isConnected) {
                      const connected = await connectWallet();
                      if (connected) {
                        window.location.href = '/fusion/maker';
                      }
                    } else {
                      window.location.href = '/fusion/maker';
                    }
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 transition whitespace-nowrap"
                >
                  Maker
                </button>
                <button
                  onClick={async () => {
                    setDropdownOpen(false);
                    if (!isConnected) {
                      const connected = await connectWallet();
                      if (connected) {
                        window.location.href = '/fusion/resolver';
                      }
                    } else {
                      window.location.href = '/fusion/resolver';
                    }
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 transition whitespace-nowrap"
                >
                  Resolver
                </button>
              </div>
            )}
          </div>

          <Link to="/limit-orders" className="hover:text-purple-400 transition">
            Limit Orders
          </Link>

          <button onClick={onHelpClick} className="hover:text-purple-400 transition">
            Help
          </button>
        </div>

        <button 
          onClick={handleWalletClick}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-full border backdrop-blur transition-all ${
            isConnected 
              ? 'bg-green-400/20 hover:bg-green-400/30 text-green-300 border-green-400' 
              : 'bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 border-purple-400'
          } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isConnecting ? 'Connecting...' : isConnected ? formatAddress(account) : 'Connect Wallet'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
