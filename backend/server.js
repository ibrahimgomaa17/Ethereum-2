require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to Geth Blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL, { chainId: 1337, name: "geth" });

/**
 * ✅ Helper Function: Load a Smart Contract
 */
const loadContract = (abi, contractAddress) => {
    return new ethers.Contract(contractAddress, abi, provider);
};

// ✅ Load Smart Contracts
const userRegistryABI = require("./abis/UserRegistry.json");  // Ensure you store ABI JSON in ./abis
const propertyRegistryABI = require("./abis/PropertyRegistry.json");

const userRegistry = loadContract(userRegistryABI, process.env.USER_REGISTRY_ADDRESS);
const propertyRegistry = loadContract(propertyRegistryABI, process.env.PROPERTY_REGISTRY_ADDRESS);
const iface = new ethers.Interface(propertyRegistryABI);

/**
 * 🚀 **Admin APIs**
 */

// ✅ Assign the first PoA account as admin
app.post("/make-poa-admin", async (req, res) => {
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

// ✅ Create a new admin
app.post("/add-admin", async (req, res) => {
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

// ✅ Remove an admin (Only PoA Admin)
app.post("/remove-admin", async (req, res) => {
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

/**
 * 🚀 **User Management APIs**
 */

// ✅ Register a new user (Admin Only)
app.post("/register-user", async (req, res) => {
    try {
        const { adminPrivateKey, userId } = req.body;
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const isAdmin = await contractWithSigner.isAdmin(wallet.address);
        if (!isAdmin) return res.status(403).json({ error: "❌ Unauthorized! Only admins can register users." });

        const newWallet = ethers.Wallet.createRandom();
        const tx = await contractWithSigner.registerUser(userId, newWallet.address, false);
        await tx.wait();

        res.json({
            message: "✅ User registered successfully!",
            user: { userId, walletAddress: newWallet.address, privateKey: newWallet.privateKey },
            admin: { adminAddress: wallet.address }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * 🚀 **Property Management APIs**
 */

// ✅ Register a Property for a User (Admin Only)
app.post("/register-property", async (req, res) => {
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

/**
 * 🚀 **Blockchain Query APIs**
 */

// ✅ Get Latest Block
app.get("/latest-block", async (req, res) => {
    try {
        const block = await provider.getBlock("latest");
        res.json(block);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Property by Unique ID
app.get("/property/id/:uniqueId", async (req, res) => {
    try {
        const property = await propertyRegistry.getProperty(req.params.uniqueId);
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Transactions for a User
app.get("/transactions/:userAddress", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        let transactions = [];

        for (let i = Math.max(0, latestBlock - 100); i <= latestBlock; i++) {
            const block = await provider.getBlockWithTransactions(i);
            block.transactions.forEach(tx => {
                if (tx.from.toLowerCase() === req.params.userAddress.toLowerCase() || tx.to?.toLowerCase() === req.params.userAddress.toLowerCase()) {
                    transactions.push(tx);
                }
            });
        }

        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Specific Transaction Details
app.get("/transaction/:hash", async (req, res) => {
    try {
        const { hash } = req.params;
        const transaction = await provider.getTransaction(hash);
        if (!transaction) return res.status(404).json({ error: "Transaction not found" });

        const receipt = await provider.getTransactionReceipt(hash);
        let decodedInput = "Unknown method";

        try {
            decodedInput = iface.parseTransaction({ data: transaction.data })?.args || "Unknown method";
        } catch (decodeError) {
            console.warn("Decoding failed:", decodeError.message);
        }

        res.json({
            transactionHash: transaction.hash,
            blockNumber: transaction.blockNumber,
            from: transaction.from,
            to: transaction.to || "Contract Creation",
            value: ethers.formatEther(transaction.value || "0"),
            gasPrice: ethers.formatEther(transaction.gasPrice || "0"),
            gasLimit: transaction.gasLimit.toString(),
            nonce: transaction.nonce,
            inputData: decodedInput,
            timestamp: new Date((await provider.getBlock(transaction.blockNumber)).timestamp * 1000).toISOString(),
            status: receipt ? (receipt.status === 1 ? "Success" : "Failed") : "Pending",
            gasUsed: receipt ? receipt.gasUsed.toString() : "Pending",
            confirmations: transaction.confirmations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * ✅ Start the Server
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Blockchain Property Registry API running at http://localhost:${PORT}`);
});
