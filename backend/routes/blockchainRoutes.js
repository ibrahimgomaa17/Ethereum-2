const express = require("express");
const { ethers } = require("ethers");

const router = express.Router();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// ✅ Get Latest Block
router.get("/latest-block", async (req, res) => {
    try {
        const block = await provider.getBlock("latest");
        res.json(block);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/blocks", async (req, res) => {
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
// ✅ Get Transactions for a User
router.get("/transactions/:userAddress", async (req, res) => {
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

module.exports = router;
