const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying Contracts...");

    // ✅ Deploy UserRegistry
    console.log("🔹 Deploying UserRegistry...");
    const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
    const userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();
    const userRegistryAddress = await userRegistry.getAddress();
    console.log(`✅ UserRegistry deployed to: ${userRegistryAddress}`);

    // ✅ Deploy PropertyRegistry
    console.log("🔹 Deploying PropertyRegistry...");
    const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
    const propertyRegistry = await PropertyRegistry.deploy();
    await propertyRegistry.waitForDeployment();
    const propertyRegistryAddress = await propertyRegistry.getAddress();
    console.log(`✅ PropertyRegistry deployed to: ${propertyRegistryAddress}`);

    console.log("🎉 Deployment completed successfully!");

    // 🔹 Save contract addresses to a file
    saveContractAddresses(userRegistryAddress, propertyRegistryAddress);

    // 🔹 Update the .env file with the new contract addresses
    updateEnvFile(userRegistryAddress, propertyRegistryAddress);
}

// ✅ Save deployed contract addresses to `deployed.json`
function saveContractAddresses(userRegistryAddress, propertyRegistryAddress) {
    const deployedData = {
        userRegistry: userRegistryAddress,
        propertyRegistry: propertyRegistryAddress,
        timestamp: new Date().toISOString(),
    };

    try {
        fs.writeFileSync("deployed.json", JSON.stringify(deployedData, null, 2));
        console.log("💾 Deployed contract addresses saved to `deployed.json`");
    } catch (error) {
        console.error("❌ Failed to save deployed addresses:", error);
    }
}

// ✅ Update `.env` file with new contract addresses
function updateEnvFile(userRegistryAddress, propertyRegistryAddress) {
    const envPath = path.join("/Users/ibrahimmohamed/Desktop/Learning/Ethereum-2/backend", ".env");

    try {
        let envContent = fs.readFileSync(envPath, "utf-8");

        // Replace old addresses with new ones
        envContent = envContent.replace(
            /USER_REGISTRY_ADDRESS=0x[a-fA-F0-9]{40}/,
            `USER_REGISTRY_ADDRESS=${userRegistryAddress}`
        );
        envContent = envContent.replace(
            /PROPERTY_REGISTRY_ADDRESS=0x[a-fA-F0-9]{40}/,
            `PROPERTY_REGISTRY_ADDRESS=${propertyRegistryAddress}`
        );

        // Save updated .env file
        fs.writeFileSync(envPath, envContent);
        console.log("✅ Updated `.env` file with new contract addresses!");
    } catch (error) {
        console.error("❌ Failed to update `.env` file:", error);
    }
}

// ✅ Execute the script
main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
