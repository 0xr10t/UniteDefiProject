module.exports = {
  networks: {
    development: {
      privateKey: `${process.env.TRON_PRIVATE_KEY}`,
      consume_user_resource_percent: 30,
      fee_limit: 1e9,
      fullHost: "https://nile.trongrid.io",
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.23" // Match the pragma in your contract
    }
  }
};
