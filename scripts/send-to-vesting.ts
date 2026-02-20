import { ethers } from "hardhat";

async function main() {
    const tokenAddress = process.env.FDFI_TOKEN_ADDRESS || "0x6988ede958ec6eB302E965b87EaF97B068977af9";
    const vestingWallet = "0x9D4cFe82A333Ed47B6d56a6550328b68d0dD4eec";
    const amount = ethers.parseUnits("1000000", 18); // 1 million FDFI tokens
    
    console.log("Token address:", tokenAddress);
    console.log("Vesting wallet:", vestingWallet);
    console.log("Amount to send:", ethers.formatUnits(amount, 18), "FDFI\n");
    
    const token = await ethers.getContractAt("FDFIToken", tokenAddress);
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    
    console.log("Deployer:", deployerAddress);
    console.log("Current owner:", await token.owner());
    
    // Check current state
    const currentSupply = await token.totalSupply();
    const transfersEnabled = await token.transfersEnabled();
    
    console.log("\nCurrent state:");
    console.log("Total supply:", ethers.formatUnits(currentSupply, 18), "FDFI");
    console.log("Transfers enabled:", transfersEnabled);
    
    // Step 1: Mint tokens if needed
    const deployerBalance = await token.balanceOf(deployerAddress);
    console.log("Deployer balance:", ethers.formatUnits(deployerBalance, 18), "FDFI");
    
    if (deployerBalance < amount) {
        console.log("\n📦 Minting tokens...");
        const mintTx = await token.mintTo(deployerAddress, amount);
        await mintTx.wait();
        console.log("✅ Minted", ethers.formatUnits(amount, 18), "FDFI");
        console.log("New balance:", ethers.formatUnits(await token.balanceOf(deployerAddress), 18), "FDFI");
    }
    
    // Step 2: Enable transfers if not enabled
    if (!transfersEnabled) {
        console.log("\n🔓 Enabling transfers...");
        const enableTx = await token.enableTransfers();
        await enableTx.wait();
        console.log("✅ Transfers enabled");
    }
    
    // Step 3: Transfer to vesting wallet
    console.log("\n💸 Transferring to vesting wallet...");
    const transferTx = await token.transfer(vestingWallet, amount);
    const receipt = await transferTx.wait();
    console.log("✅ Transfer successful!");
    console.log("Transaction hash:", receipt?.hash);
    
    // Verify final balances
    const vestingBalance = await token.balanceOf(vestingWallet);
    console.log("\n📊 Final balances:");
    console.log("Vesting wallet:", ethers.formatUnits(vestingBalance, 18), "FDFI");
    console.log("Deployer:", ethers.formatUnits(await token.balanceOf(deployerAddress), 18), "FDFI");
    console.log("Total supply:", ethers.formatUnits(await token.totalSupply(), 18), "FDFI");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
