require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to Geth Blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL, {
    chainId: 1337,
    name: "geth"
});

// ✅ Load UserRegistry Smart Contract

// ✅ Load UserRegistry Smart Contract
const userRegistryABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "userId",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "walletAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isAdmin",
                "type": "bool"
            }
        ],
        "name": "UserRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_userId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_walletAddress",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "_isAdmin",
                "type": "bool"
            }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_admin",
                "type": "address"
            }
        ],
        "name": "removeAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_addr",
                "type": "address"
            }
        ],
        "name": "isAdmin",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_walletAddress",
                "type": "address"
            }
        ],
        "name": "getUserByAddress",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_userId",
                "type": "string"
            }
        ],
        "name": "getAddressByUserId",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const userRegistry = new ethers.Contract(process.env.USER_REGISTRY_ADDRESS, userRegistryABI, provider);

// ✅ Load PropertyRegistry Smart Contract
const propertyRegistryABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_propertyType",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "registerProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uniqueId",
                "type": "string"
            }
        ],
        "name": "getProperty",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uniqueId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const propertyRegistry = new ethers.Contract(process.env.PROPERTY_REGISTRY_ADDRESS, propertyRegistryABI, provider);

// 🚀 **Admin APIs** 🚀

// ✅ Make the first PoA account an admin (Only on deployment)
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

        const tx = await contractWithSigner.registerUser("admin-" + newAdminAddress.slice(-6), newAdminAddress, true);
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

// ✅ Register a new user (Admin Only)
app.post("/register-user", async (req, res) => {
    try {
        const { adminPrivateKey, userId, walletAddress } = req.body;

        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = userRegistry.connect(wallet);

        const tx = await contractWithSigner.registerUser(userId, walletAddress, false);
        await tx.wait();

        res.json({ message: "✅ User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚀 **Property Management APIs** 🚀

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

// ✅ Transfer all properties from one user to another (Admin Only)
app.post("/transfer-user-properties", async (req, res) => {
    try {
        const { adminPrivateKey, fromUser, toUser } = req.body;

        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contractWithSigner = propertyRegistry.connect(wallet);

        const tx = await contractWithSigner.transferAllProperties(fromUser, toUser);
        await tx.wait();

        res.json({ message: "✅ All properties transferred successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Recall a property (User Only)
app.post("/recall-property", async (req, res) => {
    try {
        const { privateKey, uniqueId } = req.body;

        const wallet = new ethers.Wallet(privateKey, provider);
        const contractWithSigner = propertyRegistry.connect(wallet);

        const tx = await contractWithSigner.recallProperty(uniqueId);
        await tx.wait();

        res.json({ message: "✅ Property recalled successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚀 **User Authentication APIs** 🚀

// ✅ Authenticate a User
app.post("/authenticate-user", async (req, res) => {
    try {
        const { userId, privateKey } = req.body;

        const wallet = new ethers.Wallet(privateKey, provider);
        const userAddress = await userRegistry.getAddressByUserId(userId);

        if (wallet.address.toLowerCase() !== userAddress.toLowerCase()) {
            return res.status(401).json({ error: "Invalid authentication credentials." });
        }

        res.json({ message: "✅ Authentication successful!", userAddress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚀 **Query APIs** 🚀

// ✅ Get Property by Unique ID
app.get("/property/id/:uniqueId", async (req, res) => {
    try {
        const property = await propertyRegistry.getProperty(req.params.uniqueId);
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Properties of a User
app.get("/user/:address/properties", async (req, res) => {
    try {
        const propertyIds = await propertyRegistry.getPropertiesByOwner(req.params.address);
        res.json({ owner: req.params.address, propertyIds });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚀 **Blockchain APIs** 🚀

// ✅ Get Latest Block
app.get("/latest-block", async (req, res) => {
    try {
        const block = await provider.getBlock("latest");
        res.json({
            blockNumber: block.number,
            hash: block.hash,
            transactions: block.transactions.length,
            timestamp: new Date(block.timestamp * 1000),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Transactions by User
app.get("/transactions/:userAddress", async (req, res) => {
    try {
        const latestBlock = await provider.getBlockNumber();
        let transactions = [];

        for (let i = 0; i <= latestBlock; i++) {
            const block = await provider.getBlockWithTransactions(i);
            block.transactions.forEach(tx => {
                if (tx.from.toLowerCase() === req.params.userAddress.toLowerCase() || tx.to === req.params.userAddress) {
                    transactions.push(tx);
                }
            });
        }

        res.json({ transactions });
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
    console.log(`🚀 Blockchain Property Registry API running at http://localhost:${PORT}`);
});
