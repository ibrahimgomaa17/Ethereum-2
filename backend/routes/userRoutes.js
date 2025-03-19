const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Register User (User's Own Wallet Signs Transaction)
router.post("/register", async (req, res) => {
    try {
      const { userId } = req.body;
  
      if (!userId || !userId.trim()) {
        console.warn("Attempted registration without User ID");
        return res.status(400).json({ error: "User ID is required." });
      }
  
      // Check if the user ID already exists in the contract
      const contract = userRegistry.connect(provider);
  
      try {
        const existingUser = await contract.getUserById(userId);
        if (existingUser[1] !== ethers.ZeroAddress) {
          return res.status(400).json({ error: "User ID already exists. Please choose another one." });
        }
      } catch (error) {
        if (error.reason !== "Error: User not found.") {
          console.error("Error checking user existence:", error);
          return res.status(500).json({ error: "Failed to verify user existence." });
        }
      }
  
      // Create a new wallet for the user
      const wallet = ethers.Wallet.createRandom();
      const walletAddress = wallet.address;
      const privateKey = wallet.privateKey;
  
      // Fund the wallet
      const funder = new ethers.Wallet(process.env.POA_ADMIN_PRIVATE_KEY, provider);
      const fundTx = await funder.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther("0.01"),
      });
  
      await fundTx.wait();
  
      // Connect wallet to contract
      const walletWithProvider = wallet.connect(provider);
      const contractWithUser = userRegistry.connect(walletWithProvider);
  
      // Register user on the blockchain
      const tx = await contractWithUser.registerUser(userId);
      await tx.wait();
  
      console.log(`User "${userId}" registered successfully with wallet address ${walletAddress}`);
  
      res.status(201).json({
        message: "User registered successfully. User must save this wallet information!",
        userId,
        walletAddress,
        privateKey,
      });
  
    } catch (error) {
      console.error("Error during registration:", error);
  
      if (error.code === 'CALL_EXCEPTION' && error.reason) {
        res.status(400).json({ error: error.reason });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  });
  

module.exports = router;
