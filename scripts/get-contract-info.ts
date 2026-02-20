import { ethers } from "hardhat";

async function main() {
    const address = "0xe57cF7B467A2E419950e6E992cFe811657fd1a7F";
    
    // Get bytecode at the address
    const code = await ethers.provider.getCode(address);
    console.log("Contract exists:", code !== "0x");
    console.log("Bytecode length:", code.length);
    
    // Get transaction count (to see if contract has any activity)
    const txCount = await ethers.provider.getTransactionCount(address);
    console.log("Transaction count:", txCount);
    
    // Try to find creation transaction
    const currentBlock = await ethers.provider.getBlockNumber();
    console.log("Current block:", currentBlock);
    
    // Check balance
    const balance = await ethers.provider.getBalance(address);
    console.log("ETH Balance:", ethers.formatEther(balance));
}

main().catch(console.error);
