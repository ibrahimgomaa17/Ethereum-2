const express = require("express");
const jwt = require("jsonwebtoken");
const ethers = require("ethers");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET; // Use `.env` for security

// ✅ Load Blockchain Provider & UserRegistry Smart Contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistryABI = require("../abis/UserRegistry.json");
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Login API
router.post("/login", async (req, res) => {
    try {
        const { userId, privateKey } = req.body;

        // 🔹 1. Check if the user exists in the blockchain
        console.log(userId);
        const userData = await userRegistry.getUserById(userId);
        

        if (!userData || userData[1] === ethers.AddressZero) {
            return res.status(401).json({ error: "❌ User not found in blockchain" });
        }

        const registeredAddress = userData[1]; // Extract walletAddress from returned tuple

        // 🔹 2. Generate Wallet from Private Key
        const wallet = new ethers.Wallet(privateKey);

        // 🔹 3. Validate if the wallet address matches the blockchain stored address
        if (wallet.address.toLowerCase() !== registeredAddress.toLowerCase()) {
            return res.status(401).json({ error: "❌ Invalid private key" });
        }
        console.log(userData);

        const userRole = userData[2] ? "Admin" : "User";

        // 🔹 4. Generate JWT Token for authentication
        const token = jwt.sign({ userId, address: wallet.address }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "✅ Login successful!", token, user: { userId, walletAddress: wallet.address, userRole } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
