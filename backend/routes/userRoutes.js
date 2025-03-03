const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Register User (Admin Only)
router.post("/register", (req, res) => {
    const { userId } = req.body;

    const wallet = ethers.Wallet.createRandom();
    res.json({
        message: "Wallet created. User must call registerUser themselves.",
        userId,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey // User must save this!
    });
});

module.exports = router;
