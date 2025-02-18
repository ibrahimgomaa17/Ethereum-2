require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    geth: {
      url: process.env.RPC_URL,
      chainId: 1337, // ✅ Match Geth network ID
      gas: 40000000, // ✅ Set to match `--miner.gaslimit`
      gasPrice: 20000000000, // ✅ 20 Gwei (adjust if needed)
      accounts: [process.env.PRIVATE_KEY], // ✅ Use deployer's private key
    },
  },
};
