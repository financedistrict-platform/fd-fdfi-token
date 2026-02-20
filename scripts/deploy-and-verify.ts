import { ethers, upgrades, run } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

    // Deploy token
    console.log("Deploying SEXYToken...");
    const SEXYToken = await ethers.getContractFactory("SEXYToken");
    const proxy = await upgrades.deployProxy(
        SEXYToken,
        [deployer.address],
        { initializer: "initialize" }
    );
    await proxy.waitForDeployment();

    const proxyAddress = await proxy.getAddress();
    console.log("✅ SEXYToken proxy deployed at:", proxyAddress);

    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address:", implementationAddress);

    // Verify on-chain
    console.log("\nVerifying on-chain state...");
    const token = await ethers.getContractAt("SEXYToken", proxyAddress);
    console.log("  Name:", await token.name());
    console.log("  Symbol:", await token.symbol());
    console.log("  Owner:", await token.owner());
    console.log("  Max Supply:", ethers.formatUnits(await token.MAX_SUPPLY(), 18));

    // Wait for Etherscan indexing
    console.log("\n⏳ Waiting 30 seconds for Etherscan to index...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verify on Etherscan
    console.log("\n📝 Verifying contracts on Etherscan...");
    
    try {
        console.log("\nVerifying implementation contract...");
        await run("verify:verify", {
            address: implementationAddress,
            constructorArguments: []
        });
        console.log("✅ Implementation verified");
    } catch (error: any) {
        if (error.message.includes("already verified")) {
            console.log("✅ Implementation already verified");
        } else {
            console.log("⚠️ Implementation verification error:", error.message);
        }
    }

    try {
        console.log("\nVerifying proxy contract...");
        await run("verify:verify", {
            address: proxyAddress,
            constructorArguments: []
        });
        console.log("✅ Proxy verified");
    } catch (error: any) {
        if (error.message.includes("already verified") || error.message.includes("Already Verified")) {
            console.log("✅ Proxy already verified");
        } else {
            console.log("⚠️ Proxy verification error:", error.message);
        }
    }

    console.log("\n========================================");
    console.log("DEPLOYMENT COMPLETE");
    console.log("========================================");
    console.log("Proxy Address:", proxyAddress);
    console.log("Implementation:", implementationAddress);
    
    // Determine network for Etherscan URL
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "homestead" ? "" : `${network.name}.`;
    const etherscanUrl = `https://${networkName}etherscan.io/address/${proxyAddress}`;
    
    console.log("Etherscan:", etherscanUrl);
    console.log("\nAdd to .env:");
    console.log(`FDFI_TOKEN_ADDRESS=${proxyAddress}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
