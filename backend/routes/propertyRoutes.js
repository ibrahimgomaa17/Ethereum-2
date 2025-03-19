const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const propertyRegistryABI = require("../abis/PropertyRegistry.json");
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const propertyRegistry = new ethers.Contract(process.env.PROPERTY_REGISTRY_ADDRESS, propertyRegistryABI, provider);

router.post("/register", async (req, res) => {
    try {
      const { adminPrivateKey, name, propertyType, serialNumber, location, owner } = req.body;
  
      const wallet = new ethers.Wallet(adminPrivateKey, provider);
      const contractWithSigner = propertyRegistry.connect(wallet);
  
      const tx = await contractWithSigner.registerProperty(name, propertyType, serialNumber, location, owner);
      await tx.wait();
  
      console.log(`Property "${name}" registered successfully.`);
      
      res.status(201).json({ message: "✅ Property registered successfully!" });
    } catch (error) {
      console.error('Error registering property:', error);
  
      if (error.code === 'CALL_EXCEPTION' && error.reason) {
        res.status(400).json({ error: error.reason });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  });
  
  

module.exports = router;
