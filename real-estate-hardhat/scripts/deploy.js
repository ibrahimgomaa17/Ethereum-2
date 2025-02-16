const hre = require("hardhat");

async function main() {
    const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
    const contract = await PropertyRegistry.deploy();
    await contract.waitForDeployment();

    console.log(`🏠 PropertyRegistry deployed to: ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
