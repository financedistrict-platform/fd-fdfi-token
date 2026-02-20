import { ethers } from "hardhat";

async function main() {
    const tokenAddress = process.env.FDFI_TOKEN_ADDRESS || "0x6988ede958ec6eB302E965b87EaF97B068977af9";
    const vestingWallet = "0x9D4cFe82A333Ed47B6d56a6550328b68d0dD4eec";
    const amount = ethers.parseUnits("100000", 18); // 100,000 tokens
    
    console.log("Token Address:", tokenAddress);
    console.log("Minting to:", vestingWallet);
    console.log("Amount:", ethers.formatUnits(amount, 18), "SEXY");
    console.log("");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", await deployer.getAddress());
    
    const token = await ethers.getContractAt("SEXYToken", tokenAddress);
    
    // Check current state
    const currentSupply = await token.totalSupply();
    console.log("Current Supply:", ethers.formatUnits(currentSupply, 18));
    
    // Mint tokens
    console.log("\nMinting tokens...");
    const tx = await token.mintTo(vestingWallet, amount);
    console.log("Transaction submitted:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Minted successfully! Block:", receipt?.blockNumber);
    
    // Verify
    const newSupply = await token.totalSupply();
    const balance = await token.balanceOf(vestingWallet);
    
    console.log("\nNew Supply:", ethers.formatUnits(newSupply, 18));
    console.log("Vesting Wallet Balance:", ethers.formatUnits(balance, 18), "SEXY");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
