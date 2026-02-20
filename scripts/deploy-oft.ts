import { ethers, upgrades } from "hardhat";

/**
 * Deploy FDFIOFTUpgradeable on remote chains (BSC, Base, Arbitrum, etc.)
 * Run: NETWORK=bscTestnet npm run deploy:oft
 */
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Get LayerZero endpoint for the current network
    const network = process.env.NETWORK || "bscTestnet";
    const lzEndpoint = process.env.BSC_ENDPOINT;
    
    if (!lzEndpoint) {
        throw new Error(`${network.toUpperCase()}_ENDPOINT environment variable required`);
    }

    console.log("Network:", network);
    console.log("LayerZero Endpoint:", lzEndpoint);

    // Deploy upgradeable OFT
    const FDFIOFTUpgradeable = await ethers.getContractFactory("FDFIOFTUpgradeable");
    
    // Deploy implementation with lzEndpoint in constructor
    const implementation = await FDFIOFTUpgradeable.deploy(lzEndpoint);
    await implementation.waitForDeployment();
    console.log("Implementation deployed at:", await implementation.getAddress());

    // Deploy proxy
    const proxy = await upgrades.deployProxy(
        FDFIOFTUpgradeable,
        [
            [],                // empty rate limit configs initially
            "FDFI",           // name
            "FDFI",           // symbol
            deployer.address  // owner
        ],
        {
            initializer: "initialize",
            constructorArgs: [lzEndpoint],
            kind: "uups"
        }
    );
    await proxy.waitForDeployment();

    const proxyAddress = await proxy.getAddress();
    console.log("FDFIOFTUpgradeable proxy deployed at:", proxyAddress);
    console.log("\nSave this address to your .env file:");
    console.log(`FDFI_OFT_${network.toUpperCase()}_ADDRESS=${proxyAddress}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
