require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
    solidity: "0.8.17",
    namedAccounts: {
        deployer: {
            default: 0, // account 0 in all networks
        },
    },
};
