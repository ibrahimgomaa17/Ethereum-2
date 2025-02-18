const express = require("express");
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET ; // Use `.env` for security

// ✅ Load Blockchain Provider & UserRegistry Smart Contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistryABI = require("../abis/UserRegistry.json");
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Login API
router.post("/login", async (req, res) => {
    try {
        const { userId, privateKey } = req.body;

        // 🔹 1. Check if user exists in the blockchain
        const registeredAddress = await userRegistry.getAddressByUserId(userId);

        if (registeredAddress === ethers.constants.AddressZero) {
            return res.status(401).json({ error: "❌ User not found in blockchain" });
        }

        // 🔹 2. Generate Wallet from Private Key
        const wallet = new ethers.Wallet(privateKey);

        // 🔹 3. Validate if wallet address matches the blockchain stored address
        if (wallet.address.toLowerCase() !== registeredAddress.toLowerCase()) {
            return res.status(401).json({ error: "❌ Invalid private key" });
        }

        // 🔹 4. Generate JWT Token for authentication
        const token = jwt.sign({ userId, address: wallet.address }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "✅ Login successful!", token, user: { userId, walletAddress: wallet.address } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
