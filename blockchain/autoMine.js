function createStarterTransaction() {
    console.log("🚀 Creating 'Starter Block' transaction...");

    const sender = eth.accounts[0];

    if (!sender) {
        console.log("❌ No accounts found! Ensure the Geth node has unlocked accounts.");
        return;
    }

    const txHash = eth.sendTransaction({
        from: sender,
        to: sender, // Self-transaction to trigger block mining
        value: 0,
        data: "0x73746172746572", // "starter" in hex
        gas: 400000
    });

    console.log("  Starter transaction sent! Hash:", txHash);

    // Mine the first block
    miner.start();
    while (eth.blockNumber < 1) {
        console.log("⛏️ Waiting for starter block to be mined...");
    }
    miner.stop();
    console.log("  Starter block mined!");
}

// **AutoMine Function**
function autoMine() {
    const pendingTxs = txpool.status.pending;

    if (pendingTxs > 0) {
        console.log(`⛏️ ${pendingTxs} pending transaction(s) found! Mining a new block...`);

        miner.start();
        let startBlock = eth.blockNumber;

        while (eth.blockNumber < startBlock + 1) {
            console.log("⏳ Waiting for block to be mined...");
        }

        miner.stop();
        console.log("  Transactions confirmed. Stopping mining.");
    } else {
        console.log("  No pending transactions. No mining needed.");
    }
}

// **Ensure "Starter Block" is mined on startup**
if (eth.blockNumber === 0) {
    createStarterTransaction();
}

// **Run autoMine every 5 seconds**
setInterval(autoMine, 5000);

console.log("🔄 AutoMine script is running...");
