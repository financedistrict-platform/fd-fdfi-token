import { ethers } from "hardhat";

async function main() {
    const tokenAddress = process.env.FDFI_TOKEN_ADDRESS || "0xe57cF7B467A2E419950e6E992cFe811657fd1a7F";
    
    console.log("Verifying token at:", tokenAddress);
    console.log("================================\n");
    
    const token = await ethers.getContractAt("SEXYToken", tokenAddress);
    
    console.log("Token Name:", await token.name());
    console.log("Token Symbol:", await token.symbol());
    console.log("Decimals:", await token.decimals());
    console.log("Max Supply:", ethers.formatUnits(await token.MAX_SUPPLY(), 18));
    console.log("Current Supply:", ethers.formatUnits(await token.totalSupply(), 18));
    console.log("Transfers Enabled:", await token.transfersEnabled());
    console.log("Owner:", await token.owner());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
