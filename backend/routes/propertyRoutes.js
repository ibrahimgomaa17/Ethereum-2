const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const propertyRegistryABI = require("../abis/PropertyRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const propertyRegistry = new ethers.Contract(process.env.PROPERTY_REGISTRY_ADDRESS, propertyRegistryABI, provider);

// ✅ Register Property
router.post("/register", async (req, res) => {
    try {
        const { adminPrivateKey, name, propertyType, serialNumber, location, owner } = req.body;
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = propertyRegistry.connect(wallet);

        const tx = await contractWithSigner.registerProperty(name, propertyType, serialNumber, location, owner);
        await tx.wait();

        res.json({ message: "✅ Property registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
