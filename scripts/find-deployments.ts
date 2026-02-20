import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    
    console.log("Checking transactions for:", address);
    console.log("=====================================\n");
    
    const txCount = await ethers.provider.getTransactionCount(address);
    console.log("Total transactions:", txCount);
    
    if (txCount === 0) {
        console.log("No transactions found!");
        return;
    }
    
    // Check recent blocks for transactions from this address
    const currentBlock = await ethers.provider.getBlockNumber();
    const blocksToCheck = 1000; // Check last 1000 blocks
    
    console.log(`Checking last ${blocksToCheck} blocks...\n`);
    
    for (let i = 0; i < blocksToCheck && i < currentBlock; i++) {
        const blockNum = currentBlock - i;
        const block = await ethers.provider.getBlock(blockNum, true);
        
        if (block && block.transactions) {
            for (const tx of block.transactions) {
                if (typeof tx === 'object' && tx.from.toLowerCase() === address.toLowerCase()) {
                    console.log("Found transaction:");
                    console.log("  Hash:", tx.hash);
                    console.log("  Block:", blockNum);
                    console.log("  To:", tx.to || "(Contract Creation)");
                    console.log("  Value:", ethers.formatEther(tx.value), "ETH");
                    
                    // Get receipt to check if it's a contract creation
                    const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
                    if (receipt) {
                        console.log("  Status:", receipt.status === 1 ? "Success" : "Failed");
                        if (receipt.contractAddress) {
                            console.log("  Contract Created:", receipt.contractAddress);
                        }
                    }
                    console.log("");
                }
            }
        }
    }
}

main().catch(console.error);
