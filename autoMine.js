function createStarterTransaction() {
    console.log("🚀 Creating 'Starter Block' transaction...");

    const sender = eth.accounts[0];
    const txHash = eth.sendTransaction({
        from: sender,
        to: sender, // Self-transaction to ensure a block is mined
        value: web3.toWei(0, "ether"),
        data: web3.toHex("Starter Block"),
        gas: 100000
    });

    console.log("✅ Starter transaction sent! Hash:", txHash);

    // Mine exactly one block
    miner.start();
    while (eth.getBlock("latest").number < 1) {
        admin.sleepBlocks(1); // Wait until block is mined
    }
    miner.stop();
    console.log("✅ Starter block mined!");
}

function autoMine() {
    const pendingTxs = eth.pendingTransactions;

    if (pendingTxs.length > 0) {
        console.log(`⛏️ ${pendingTxs.length} pending transaction(s) found! Mining one block...`);
        
        miner.start();
        let startBlock = eth.getBlock("latest").number;
        
        while (eth.getBlock("latest").number < startBlock + 1) {
            admin.sleepBlocks(1);
        }
        
        miner.stop();
        console.log("✅ Transactions confirmed. Stopping mining.");
    } else {
        console.log("✅ No pending transactions. No mining needed.");
    }
}

// Ensure "Starter Block" is mined on startup
if (eth.getBlock("latest").number === 0) {
    createStarterTransaction();
}

// Run autoMine every 5 seconds
setInterval(autoMine, 5000);

console.log("🔄 AutoMine script is running...");
