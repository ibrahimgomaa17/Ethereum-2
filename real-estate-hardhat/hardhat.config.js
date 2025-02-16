require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    development: {
      url: "http://127.0.0.1:8545",
      gas: 12000000, // ✅ Lowered to fit inside block gas limit
      accounts: ["4a6d6453e733a2f8b5c46234886f0a4d08c1a717943e71d817da6694c37bee00"]
    }
  }
};
