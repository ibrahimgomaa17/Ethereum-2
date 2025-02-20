require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

// ✅ Initialize Express
const app = express();
app.use(express.json());

// ✅ CORS Configuration (Explicitly Allow Frontend)
app.use(cors({
    origin: "http://localhost:5173", // ✅ Allow only frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ Allow HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow headers
    credentials: true // ✅ Allow authentication headers & cookies
}));

// ✅ Handle Preflight Requests Manually
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

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
    console.log(`🚀 Blockchain API running at http://localhost:${PORT}`);
});
