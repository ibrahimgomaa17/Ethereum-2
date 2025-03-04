const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Register User (User's Own Wallet Signs Transaction)
router.post("/register", async (req, res) => {
    const { userId } = req.body;

    // 1. Create new wallet (represents the user)
    const wallet = ethers.Wallet.createRandom();

    // OPTIONAL: Fund the wallet if necessary (PoA might cover gas for free — check your chain rules)
    const funder = new ethers.Wallet(process.env.POA_ADMIN_PRIVATE_KEY, provider);
    const fundTx = await funder.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther("0.01") // Adjust if needed
    });
    await fundTx.wait();

    // 2. User wallet connects to the contract
    const walletWithProvider = wallet.connect(provider);
    const contractWithUser = userRegistry.connect(walletWithProvider);

    // 3. Register user (user wallet signs this)
    const tx = await contractWithUser.registerUser(userId);
    await tx.wait();

    // 4. Respond to client with wallet details
    res.json({
        message: "User registered successfully. User must save this wallet information!",
        userId,
        walletAddress: wallet.address,
        privateKey: wallet.privateKey // ⚠️ IMPORTANT: Tell user to save this securely!
    });
});

module.exports = router;
