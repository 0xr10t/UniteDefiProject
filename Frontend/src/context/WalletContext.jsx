import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setIsConnected(true);
        setIsConnecting(false);
        return true;
      } catch (error) {
        console.error("User denied account access");
        setIsConnecting(false);
        return false;
      }
    } else {
      alert('Please install MetaMask!');
      setIsConnecting(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setIsConnected(false);
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else {
          // User switched accounts
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const value = {
    web3,
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 