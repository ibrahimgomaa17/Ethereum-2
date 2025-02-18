const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const userRegistryABI = require("../abis/UserRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Make PoA Admin
router.post("/make-poa-admin", async (req, res) => {
    try {
        const { privateKey } = req.body;
        const wallet = new ethers.Wallet(privateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const tx = await contractWithSigner.registerUser("admin", wallet.address, true);
        await tx.wait();

        res.json({ message: "✅ PoA Admin registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Add New Admin
router.post("/add", async (req, res) => {
    try {
        const { adminPrivateKey, newAdminAddress } = req.body;
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const tx = await contractWithSigner.registerUser(`admin-${newAdminAddress.slice(-6)}`, newAdminAddress, true);
        await tx.wait();

        res.json({ message: "✅ New admin added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Remove an Admin
router.post("/remove", async (req, res) => {
    try {
        const { poaAdminPrivateKey, adminToRemove } = req.body;
        const wallet = new ethers.Wallet(poaAdminPrivateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const tx = await contractWithSigner.removeAdmin(adminToRemove);
        await tx.wait();

        res.json({ message: "✅ Admin removed successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
