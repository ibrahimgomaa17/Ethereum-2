const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying Contracts...");

    // ✅ Deploy UserRegistry
    console.log("🔹 Deploying UserRegistry...");
    const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
    const userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();
    console.log(`✅ UserRegistry deployed to: ${userRegistry.target}`);

    // ✅ Deploy PropertyRegistry
    console.log("🔹 Deploying PropertyRegistry...");
    const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
    const propertyRegistry = await PropertyRegistry.deploy();
    await propertyRegistry.waitForDeployment();
    console.log(`✅ PropertyRegistry deployed to: ${propertyRegistry.target}`);

    console.log("🎉 Deployment completed successfully!");

    // 🔹 Save contract addresses to a file
    saveContractAddresses(userRegistry.target, propertyRegistry.target);
}

// ✅ Save deployed contract addresses to `deployed.json`
function saveContractAddresses(userRegistryAddress, propertyRegistryAddress) {
    const fs = require("fs");
    const deployedData = {
        userRegistry: userRegistryAddress,
        propertyRegistry: propertyRegistryAddress,
    };
    fs.writeFileSync("deployed.json", JSON.stringify(deployedData, null, 2));
    console.log("💾 Deployed contract addresses saved to `deployed.json`");
}

// ✅ Execute the script
main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
