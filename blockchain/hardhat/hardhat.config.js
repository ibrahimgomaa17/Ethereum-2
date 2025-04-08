require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require('@nomicfoundation/hardhat-toolbox');
require('@typechain/hardhat');
module.exports = {
  solidity: "0.8.20",
  networks: {
    geth: {
      url: process.env.RPC_URL,
      chainId: 1337, // Make sure your Geth node uses this chain ID
      gas: 30_000_000, // Transaction gas limit (can go up to block gas limit)
      gasPrice: 20_000_000_000, // 20 Gwei
      accounts: [process.env.PRIVATE_KEY], // ✅ Use deployer's private key
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v6',
  },
};
