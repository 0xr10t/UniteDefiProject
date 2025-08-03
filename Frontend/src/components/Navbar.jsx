/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/components/Navbar.jsx */
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar({ onHelpClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-black/20 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Professional Logo */}
        <Link to="/" className="flex items-center space-x-3 select-none" draggable={false}>
          <img 
            src="/unitedefi.png" 
            alt="MeowSwap" 
            className="w-15 h-10 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MeowSwap
            </span>
            <span className="text-xs text-gray-400 -mt-1">Cross-Chain Protocol</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/fusion" 
            className="relative group py-2 hover:text-purple-400 transition-all duration-200 select-none"
            draggable={false}
          >
            Fusion+
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-200"></span>
          </Link>
          <Link 
            to="/limit-orders" 
            className="relative group py-2 hover:text-purple-400 transition-all duration-200 select-none"
            draggable={false}
          >
              Limit Orders
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-200"></span>
          </Link>
          <button 
            onClick={onHelpClick} 
            className="relative group py-2 hover:text-purple-400 transition-all duration-200 select-none"
            draggable={false}
          >
            Help
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-200"></span>
          </button>
        </div>

        {/* Enhanced Connect Wallet Button */}
        <div className="hidden md:block">
          <button 
            className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl select-none group"
            draggable={false}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect Wallet</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors select-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          draggable={false}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 select-none">
          <div className="px-6 py-4 space-y-4">
            <Link 
              to="/fusion" 
              className="block hover:text-purple-400 transition-all duration-200 py-2 select-none"
              draggable={false}
              onClick={() => setMobileMenuOpen(false)}
            >
              Fusion+
            </Link>
            <Link 
              to="/limit-orders" 
              className="block hover:text-purple-400 transition-all duration-200 py-2 select-none"
              draggable={false}
              onClick={() => setMobileMenuOpen(false)}
            >
              Limit Orders
            </Link>
            <button 
              onClick={() => {
                onHelpClick();
                setMobileMenuOpen(false);
              }} 
              className="block hover:text-purple-400 transition-all duration-200 py-2 w-full text-left select-none"
              draggable={false}
            >
              Help
            </button>
            <button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg select-none"
              draggable={false}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;