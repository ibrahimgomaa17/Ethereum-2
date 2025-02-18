const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Register User (Admin Only)
router.post("/register", async (req, res) => {
    try {
        const { adminPrivateKey, userId } = req.body;
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const isAdmin = await contractWithSigner.isAdmin(wallet.address);
        if (!isAdmin) return res.status(403).json({ error: "❌ Unauthorized!" });

        const newWallet = ethers.Wallet.createRandom();
        const tx = await contractWithSigner.registerUser(userId, newWallet.address, false);
        await tx.wait();

        res.json({ message: "✅ User registered!", userId, walletAddress: newWallet.address });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
