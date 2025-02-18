require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

// ✅ Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to Geth Blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL, { chainId: 1337, name: "geth" });

// ✅ Load Routes
const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");

// ✅ Register Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/property", propertyRoutes);
app.use("/blockchain", blockchainRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Blockchain Property Registry API running at http://localhost:${PORT}`);
});
