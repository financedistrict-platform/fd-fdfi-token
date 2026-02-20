import { ethers } from "hardhat";

async function main() {
    const tokenAddress = process.env.FDFI_TOKEN_ADDRESS || "0x6988ede958ec6eB302E965b87EaF97B068977af9";
    const recipient = "0x228f0F5fc4897efad522C1a96308f2Daf2f4ff58";
    const amount = ethers.parseUnits("1000000", 18); // 1,000,000 tokens
    
    console.log("Token Address:", tokenAddress);
    console.log("Minting to:", recipient);
    console.log("Amount:", ethers.formatUnits(amount, 18), "FDFI");
    console.log("");
    
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", await deployer.getAddress());
    
    const token = await ethers.getContractAt("FDFIToken", tokenAddress);
    
    // Check current state
    const currentSupply = await token.totalSupply();
    console.log("Current Supply:", ethers.formatUnits(currentSupply, 18));
    
    // Mint tokens
    console.log("\nMinting tokens...");
    const tx = await token.mintTo(recipient, amount);
    console.log("Transaction submitted:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Minted successfully! Block:", receipt?.blockNumber);
    
    // Verify
    const newSupply = await token.totalSupply();
    const balance = await token.balanceOf(recipient);
    
    console.log("\nNew Supply:", ethers.formatUnits(newSupply, 18));
    console.log("Recipient Balance:", ethers.formatUnits(balance, 18), "FDFI");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
