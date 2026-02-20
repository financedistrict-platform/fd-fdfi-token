import { run, upgrades } from "hardhat";

async function main() {
    const proxyAddress = process.env.FDFI_TOKEN_ADDRESS;
    if (!proxyAddress) {
        throw new Error("FDFI_TOKEN_ADDRESS environment variable required");
    }

    console.log("Verifying contracts for proxy:", proxyAddress);
    
    // Get implementation address
    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation address:", implementationAddress);

    console.log("\n📝 Verifying on Etherscan...\n");

    // Verify implementation
    try {
        console.log("Verifying implementation contract...");
        await run("verify:verify", {
            address: implementationAddress,
            constructorArguments: []
        });
        console.log("✅ Implementation verified successfully");
    } catch (error: any) {
        if (error.message.includes("already verified")) {
            console.log("✅ Implementation already verified");
        } else {
            console.log("❌ Implementation verification failed:", error.message);
        }
    }

    // Verify proxy
    try {
        console.log("\nVerifying proxy contract...");
        await run("verify:verify", {
            address: proxyAddress,
            constructorArguments: []
        });
        console.log("✅ Proxy verified successfully");
    } catch (error: any) {
        if (error.message.includes("already verified") || error.message.includes("Already Verified")) {
            console.log("✅ Proxy already verified");
        } else {
            console.log("❌ Proxy verification failed:", error.message);
        }
    }

    console.log("\n========================================");
    console.log("VERIFICATION COMPLETE");
    console.log("========================================");
    console.log("Proxy:", `https://sepolia.etherscan.io/address/${proxyAddress}`);
    console.log("Implementation:", `https://sepolia.etherscan.io/address/${implementationAddress}#code`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
