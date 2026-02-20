import { ethers } from "hardhat";

/**
 * Deploy FDFIOFTAdapter on Sepolia (source chain with the main token)
 * Run: NETWORK=sepolia npm run deploy:adapter
 */
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // Get FDFIToken address from environment or prompt
    const tokenAddress = process.env.FDFI_TOKEN_ADDRESS;
    if (!tokenAddress) {
        throw new Error("FDFI_TOKEN_ADDRESS environment variable required");
    }

    const lzEndpoint = process.env.SEPOLIA_ENDPOINT;
    if (!lzEndpoint) {
        throw new Error("SEPOLIA_ENDPOINT environment variable required");
    }

    console.log("Token address:", tokenAddress);
    console.log("LayerZero Endpoint:", lzEndpoint);

    // Deploy adapter with empty rate limit configs (can configure later)
    const FDFIOFTAdapter = await ethers.getContractFactory("FDFIOFTAdapter");
    const adapter = await FDFIOFTAdapter.deploy(
        tokenAddress,      // underlying token
        lzEndpoint,        // LayerZero endpoint
        deployer.address,  // owner
        []                 // empty rate limit configs initially
    );
    await adapter.waitForDeployment();

    const adapterAddress = await adapter.getAddress();
    console.log("FDFIOFTAdapter deployed at:", adapterAddress);
    console.log("\nSave this address to your .env file:");
    console.log(`FDFI_ADAPTER_ADDRESS=${adapterAddress}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
