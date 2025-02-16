require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Connect to Private Blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 🔹 Smart Contract ABI
const contractABI = [
    "function registerProperty(string memory _name, string memory _propertyType, string memory _serialNumber, string memory _location) public",
    "function getProperty(string memory _uniqueId) public view returns (string memory, string memory, string memory, string memory, string memory, address)",
    "function getPropertiesByOwner(address _owner) public view returns (string[] memory)",
    "function getPropertyBySerial(string memory _serialNumber) public view returns (string memory, string memory, string memory, string memory, string memory, address)",
    "function getPropertyByName(string memory _name) public view returns (string memory, string memory, string memory, string memory, string memory, address)",
    "function getAllProperties() public view returns (string[] memory)",
    "function transferProperty(string memory _uniqueId, address _newOwner) public"
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// 🔹 API Routes

// ✅ Register a Property
app.post("/register-property", async (req, res) => {
    try {
        const { name, propertyType, serialNumber, location, userAddress } = req.body;
        if (!name || !propertyType || !serialNumber || !userAddress) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const tx = await contract.connect(wallet).registerProperty(name, propertyType, serialNumber, location, { from: userAddress });
        await tx.wait();
        res.json({ message: "Property registered successfully!", transactionHash: tx.hash, owner: userAddress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Properties by Owner (Returns JSON)
app.get("/user/:address/properties", async (req, res) => {
    try {
        const propertyIds = await contract.getPropertiesByOwner(req.params.address);
        let properties = [];

        for (const id of propertyIds) {
            const property = await contract.getProperty(id);
            properties.push({
                uniqueId: property[0],
                name: property[1],
                type: property[2],
                serialNumber: property[3],
                location: property[4] || "N/A",
                owner: property[5]
            });
        }

        res.json({ owner: req.params.address, properties });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Property by Unique ID
app.get("/property/id/:uniqueId", async (req, res) => {
    try {
        const property = await contract.getProperty(req.params.uniqueId);
        res.json({
            uniqueId: property[0],
            name: property[1],
            type: property[2],
            serialNumber: property[3],
            location: property[4] || "N/A",
            owner: property[5]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Property by Serial Number

app.get("/property/serial/:serialNumber", async (req, res) => {
    try {
        const property = await contract.getPropertyBySerial(req.params.serialNumber);
        res.json({
            uniqueId: property[0],
            name: property[1],
            type: property[2],
            serialNumber: property[3],
            location: property[4] || "N/A",
            owner: property[5]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Property by Name
app.get("/property/name/:name", async (req, res) => {
    try {
        const property = await contract.getPropertyByName(req.params.name);
        res.json({
            uniqueId: property[0],
            name: property[1],
            type: property[2],
            serialNumber: property[3],
            location: property[4] || "N/A",
            owner: property[5]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Properties
app.get("/properties", async (req, res) => {
    try {
        const propertyIds = await contract.getAllProperties();
        let properties = [];

        for (const id of propertyIds) {
            const property = await contract.getProperty(id);
            properties.push({
                uniqueId: property[0],
                name: property[1],
                type: property[2],
                serialNumber: property[3],
                location: property[4] || "N/A",
                owner: property[5]
            });
        }

        res.json({ properties });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Transfer Property Ownership
app.post("/transfer-property", async (req, res) => {
    try {
        const { uniqueId, newOwner } = req.body;
        if (!uniqueId || !newOwner) {
            return res.status(400).json({ error: "Unique ID and new owner address are required" });
        }

        const tx = await contract.connect(wallet).transferProperty(uniqueId, newOwner);
        await tx.wait();

        res.json({ message: "Ownership transferred successfully!", transactionHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 Get List of All Blocks
app.get("/blocks", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        let blocks = [];
        for (let i = 0; i <= latestBlock; i++) {
            const block = await provider.getBlock(i, true);
            blocks.push({
                blockNumber: block.number,
                hash: block.hash,
                parentHash: block.parentHash,
                miner: block.miner,
                transactions: block.transactions.length,
                timestamp: new Date(block.timestamp * 1000),
                gasUsed: block.gasUsed.toString(),
                gasLimit: block.gasLimit.toString()
            });
        }
        res.json({ blocks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get Latest Block
app.get("/latest-block", async (req, res) => {
    try {
        const block = await provider.getBlock("latest");
        res.json({
            blockNumber: block.number,
            hash: block.hash,
            parentHash: block.parentHash,
            miner: block.miner,
            transactions: block.transactions.length,
            timestamp: new Date(block.timestamp * 1000),
            gasUsed: block.gasUsed.toString(),
            gasLimit: block.gasLimit.toString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get List of All Transactions
app.get("/transactions", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        let transactions = [];
        for (let i = 0; i <= latestBlock; i++) {
            const block = await provider.getBlockWithTransactions(i);
            block.transactions.forEach(tx => {
                transactions.push({
                    hash: tx.hash,
                    from: tx.from,
                    to: tx.to,
                    value: ethers.formatEther(tx.value),
                    gasPrice: ethers.formatEther(tx.gasPrice),
                    timestamp: new Date(block.timestamp * 1000)
                });
            });
        }
        res.json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get Latest Transaction
app.get("/latest-transaction", async (req, res) => {
    try {
        const latestBlock = await provider.getBlock("latest", true);
        const transactions = latestBlock.transactions;
        if (transactions.length > 0) {
            res.json(transactions[transactions.length - 1]);
        } else {
            res.json({ message: "No transactions in the latest block" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get Transactions by User
app.get("/user/:address/transactions", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        let transactions = [];
        for (let i = 0; i <= latestBlock; i++) {
            const block = await provider.getBlockWithTransactions(i);
            block.transactions.forEach(tx => {
                if (tx.from.toLowerCase() === req.params.address.toLowerCase() || (tx.to && tx.to.toLowerCase() === req.params.address.toLowerCase())) {
                    transactions.push({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: ethers.formatEther(tx.value),
                        gasPrice: ethers.formatEther(tx.gasPrice),
                        timestamp: new Date(block.timestamp * 1000)
                    });
                }
            });
        }
        res.json({ address: req.params.address, transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Blockchain Property Registry running at http://localhost:${PORT}`);
});
