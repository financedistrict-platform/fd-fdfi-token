import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    
    console.log("Deployer address:", address);
    
    const txCount = await ethers.provider.getTransactionCount(address);
    console.log("Transaction count:", txCount);
    
    const balance = await ethers.provider.getBalance(address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
    
    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);
    
    // Get recent blocks to see network activity
    const currentBlock = await ethers.provider.getBlockNumber();
    console.log("Current block:", currentBlock);
}

main().catch(console.error);
