import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const tokenAddress = process.env.FDFI_TOKEN_TESTNET;
    if (!tokenAddress) throw new Error("FDFI_TOKEN_TESTNET not set in .env");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer address:", deployer.address);

    const token = await ethers.getContractAt("SEXYToken", tokenAddress);
    const owner = await token.owner();
    const transfersEnabled = await token.transfersEnabled();

    console.log("Contract owner:", owner);
    console.log("Transfers enabled:", transfersEnabled);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
