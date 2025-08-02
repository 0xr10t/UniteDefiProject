import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ onHelpClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <Link
                  to="/fusion/maker"
                  className="block px-4 py-2 hover:bg-white/10 transition whitespace-nowrap"
                  onClick={() => setDropdownOpen(false)}
                >
                  Maker
                </Link>
                <Link
                  to="/fusion/resolver"
                  className="block px-4 py-2 hover:bg-white/10 transition whitespace-nowrap"
                  onClick={() => setDropdownOpen(false)}
                >
                  Resolver
                </Link>
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

        <button className="bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 px-4 py-2 rounded-full border border-purple-400 backdrop-blur">
          Connect Wallet
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
