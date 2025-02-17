const hre = require("hardhat");
require("dotenv").config();
const { ethers } = require("ethers");

async function main() {
    console.log("🚀 Deploying PropertyRegistry to Geth...");

    // ✅ Connect to Geth Node
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL, {
        chainId: 1337,  // ✅ Ensure correct chainId
        name: "geth",
    });

    // ✅ Validate Private Key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
        throw new Error("❌ Invalid PRIVATE_KEY in .env file. Make sure it starts with '0x' and is 66 characters long.");
    }

    // ✅ Connect Deployer Wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`🔑 Using deployer address: ${wallet.address}`);

    // ✅ Deploy Smart Contract
    const PropertyRegistry = await hre.ethers.getContractFactory("UserRegistry", wallet);
    const contract = await PropertyRegistry.deploy();

    // ✅ Wait for deployment confirmation
    await contract.waitForDeployment();
    console.log(`🏠 PropertyRegistry deployed to: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
