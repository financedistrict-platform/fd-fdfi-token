import { ethers } from "hardhat";

async function main() {
    const txHashes = [
        "0xd239d9f7e779e05688abe703b5785bff25a66c93d2497464746a43e9cff8a501",
        "0x6ded2e163c46de9c4cdab210d9e3b2176a4613b6ce40032df5d52af44a1eaa05",
        "0x6557f70aa51b69cccb18f3689ad34924013da59d9fda5ef5d2863337b50a3a7f"
    ];
    
    for (const hash of txHashes) {
        console.log("\n========================================");
        console.log("Transaction:", hash);
        
        const receipt = await ethers.provider.getTransactionReceipt(hash);
        if (receipt) {
            console.log("Status:", receipt.status === 1 ? "✅ Success" : "❌ Failed");
            console.log("Block:", receipt.blockNumber);
            console.log("Gas Used:", receipt.gasUsed.toString());
            
            if (receipt.contractAddress) {
                console.log("Contract Address:", receipt.contractAddress);
                
                // Check if bytecode exists
                const code = await ethers.provider.getCode(receipt.contractAddress);
                console.log("Has Code:", code !== "0x", "(", code.length, "bytes)");
                
                // Try to interact with it as SEXYToken
                try {
                    const token = await ethers.getContractAt("SEXYToken", receipt.contractAddress);
                    const name = await token.name();
                    const symbol = await token.symbol();
                    console.log("Token Name:", name);
                    console.log("Token Symbol:", symbol);
                    console.log("✅ This is the SEXY token!");
                } catch (e) {
                    console.log("Not a SEXYToken (might be implementation or other contract)");
                }
            }
        }
    }
}

main().catch(console.error);
