import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    const balance = await ethers.provider.getBalance(address);
    
    console.log("Deployer address:", address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
    console.log("Balance (wei):", balance.toString());
    
    if (balance === 0n) {
        console.log("\n❌ No funds available. Please fund this wallet with Sepolia ETH:");
        console.log("   https://www.alchemy.com/faucets/ethereum-sepolia");
    } else {
        console.log("\n✅ Wallet has funds, ready to deploy!");
    }
}

main().catch(console.error);
