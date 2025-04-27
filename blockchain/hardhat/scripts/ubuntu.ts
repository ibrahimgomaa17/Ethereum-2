const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Deploying Contracts...");

    // Deploy UserRegistry
    const userRegistryAddress = await deployContract("UserRegistry");

    // Deploy PropertyRegistry
    const propertyRegistryAddress = await deployContract("PropertyRegistry");

    console.log("🎉 Deployment completed successfully!");

    // Save deployed addresses
    saveContractAddresses(userRegistryAddress, propertyRegistryAddress);

    // Update .env file
    updateEnvFile(userRegistryAddress, propertyRegistryAddress);

    // Copy ABIs
    copyAbisToBackend(["UserRegistry", "PropertyRegistry"]);
}

// 📦 Deploy contract by name
async function deployContract(contractName) {
    try {
        console.log(`🔹 Deploying ${contractName}...`);
        const Contract = await hre.ethers.getContractFactory(contractName);
        const instance = await Contract.deploy();
        await instance.waitForDeployment();
        const address = await instance.getAddress();
        console.log(`✅ ${contractName} deployed to: ${address}`);
        return address;
    } catch (err) {
        console.error(`❌ Error deploying ${contractName}:`, err);
        process.exit(1);
    }
}

// 💾 Save deployed addresses to deployed.json
function saveContractAddresses(userRegistryAddress, propertyRegistryAddress) {
    const deployedData = {
        userRegistry: userRegistryAddress,
        propertyRegistry: propertyRegistryAddress,
        timestamp: new Date().toISOString(),
    };

    try {
        fs.writeFileSync("deployed.json", JSON.stringify(deployedData, null, 2));
        console.log("💾 Contract addresses saved to deployed.json");
    } catch (error) {
        console.error("❌ Failed to save deployed.json:", error);
    }
}

// 🔧 Update .env in backend
function updateEnvFile(userRegistryAddress, propertyRegistryAddress) {
    const envPath = path.resolve(__dirname, "../../../backend/.env");

    try {
        let envContent = fs.readFileSync(envPath, "utf-8");

        envContent = replaceEnvVar(envContent, "USER_REGISTRY_ADDRESS", userRegistryAddress);
        envContent = replaceEnvVar(envContent, "PROPERTY_REGISTRY_ADDRESS", propertyRegistryAddress);

        fs.writeFileSync(envPath, envContent);
        console.log("✅ .env file updated with contract addresses");
    } catch (error) {
        console.error("❌ Failed to update .env file:", error);
    }
}

function replaceEnvVar(content, key, value) {
    const regex = new RegExp(`${key}=0x[a-fA-F0-9]{40}`);
    return regex.test(content)
        ? content.replace(regex, `${key}=${value}`)
        : content + `\n${key}=${value}`;
}

// 📁 Copy ABIs to backend
function copyAbisToBackend(contractNames) {
    const targetDir = path.resolve(__dirname, "../../../backend/src/contracts");

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    contractNames.forEach((name) => {
        const artifactPath = path.resolve(__dirname, `../artifacts/contracts/${name}.sol/${name}.json`);
        try {
            const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
            const abi = artifact.abi;

            const outputPath = path.join(targetDir, `${name}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(abi, null, 2));
            console.log(`✅ ABI for ${name} copied to backend/src/contracts`);
        } catch (err) {
            console.error(`❌ Failed to copy ABI for ${name}:`, err);
        }
    });
}

// ▶️ Start the script
main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
});
