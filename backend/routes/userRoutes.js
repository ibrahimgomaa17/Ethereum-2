const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Register User (Admin Only)
router.post("/register", async (req, res) => {
    try {
        const { userId } = req.body;

        // ✅ 1. Generate new wallet (address + private key)
        const newWallet = ethers.Wallet.createRandom();

        // ✅ 2. Admin wallet acts as the sender (PoA node)
        const adminWallet = new ethers.Wallet(process.env.POA_ADMIN_PRIVATE_KEY, provider);
        const contractWithAdmin = userRegistry.connect(adminWallet);

        // ✅ 3. Call `registerUser` - no gas is needed (PoA handles this internally)
        const tx = await contractWithAdmin.registerUser(userId, newWallet.address, false);
        await tx.wait();

        // ✅ 4. Return new wallet details to user (user MUST save the private key)
        res.json({
            message: "✅ User registered successfully!",
            userId,
            walletAddress: newWallet.address,
            privateKey: newWallet.privateKey, // ⚠️ Important: user must store this securely
        });
    } catch (error) {
        console.error("Registration failed:", error);
        res.status(500).json({ error: error.reason || error.message });
    }
});

module.exports = router;
