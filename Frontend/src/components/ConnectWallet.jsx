import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; 

function ConnectWallet() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-black/50 backdrop-blur-lg p-6 shadow-xl">
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={20} />
        </button>

        <h2 className="text-center text-xl font-semibold mb-6">Connect Or Create Wallet</h2>

        <div className="flex justify-center items-center mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-sm text-gray-300">
            LOGO
          </div>
        </div>

        <button
          className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition mb-6"
          onClick={() => alert("Login with email/socials")}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <img
                src="https://img.icons8.com/ios/50/user--v1.png"
                alt="user"
                className="w-5 h-5"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Login with email or socials</p>
              <p className="text-xs text-white/40">description</p>
            </div>
          </div>
          <span className="text-xl text-white/40">&rsaquo;</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
          <hr className="flex-grow border-white/20" />
          <span>or</span>
          <hr className="flex-grow border-white/20" />
        </div>

        <button
          className="w-full flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition mb-4"
          onClick={() => alert("Connect Metamask")}
        >
          <img
            src="https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png"
            alt="metamask"
            className="w-6 h-6"
          />
          <span className="text-sm font-medium">Metamask</span>
        </button>

        <button
          className="w-full flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition"
          onClick={() => alert("More Wallets")}
        >
          <div className="w-6 h-6 border border-white/40 rounded-sm"></div>
          <span className="text-sm font-medium">More wallets</span>
        </button>
      </div>
    </div>
  );
}

export default ConnectWallet;