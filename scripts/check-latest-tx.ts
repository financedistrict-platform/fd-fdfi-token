import { ethers } from "hardhat";

async function main() {
    // Check the most recent deployment transaction
    const hash = "0xd239d9f7e779e05688abe703b5785bff25a66c93d2497464746a43e9cff8a501";
    
    console.log("Checking transaction:", hash);
    
    const receipt = await ethers.provider.getTransactionReceipt(hash);
    if (!receipt) {
        console.log("Receipt not found!");
        return;
    }
    
    console.log("Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
    console.log("Contract Address:", receipt.contractAddress);
    
    if (receipt.contractAddress) {
        const token = await ethers.getContractAt("FDFIToken", receipt.contractAddress);
        console.log("\nToken Details:");
        console.log("Name:", await token.name());
        console.log("Symbol:", await token.symbol());
        console.log("Decimals:", await token.decimals());
        console.log("Owner:", await token.owner());
        console.log("\n✅ FDFI Token found at:", receipt.contractAddress);
    }
}

main().catch(console.error);
