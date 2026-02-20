import { ethers } from "hardhat";

/**
 * Configure LayerZero peers between chains
 * This connects the Adapter on Sepolia with OFT on BSC (or other chains)
 * 
 * Usage:
 * 1. Set environment variables for contract addresses
 * 2. Run on each chain: 
 *    NETWORK=sepolia npm run configure:peers
 *    NETWORK=bscTestnet npm run configure:peers
 */

// LayerZero V2 Chain IDs (EndpointV2 eid)
const CHAIN_IDS = {
    sepolia: 40161,      // Ethereum Sepolia
    bscTestnet: 40102,   // BSC Testnet
    baseTestnet: 40245,  // Base Sepolia
    arbitrumSepolia: 40231, // Arbitrum Sepolia
    // Mainnets
    mainnet: 30101,      // Ethereum
    bsc: 30102,          // BSC
    base: 30184,         // Base
    arbitrum: 30110      // Arbitrum
};

async function main() {
    const [deployer] = await ethers.getSigners();
    const network = process.env.NETWORK || "";
    
    console.log("Configuring peers on:", network);
    console.log("Deployer:", deployer.address);

    let localContract: any;
    let localAddress: string;
    let remoteEid: number;
    let remoteAddress: string;

    // Determine which contract to use based on network
    if (network === "sepolia") {
        // On Sepolia, use the Adapter
        localAddress = process.env.FDFI_ADAPTER_ADDRESS || "";
        if (!localAddress) throw new Error("FDFI_ADAPTER_ADDRESS required");
        
        localContract = await ethers.getContractAt("FDFIOFTAdapter", localAddress);
        
        // Configure peer to BSC Testnet
        remoteEid = CHAIN_IDS.bscTestnet;
        remoteAddress = process.env.FDFI_OFT_BSCTESTNET_ADDRESS || "";
        if (!remoteAddress) throw new Error("FDFI_OFT_BSCTESTNET_ADDRESS required");
        
    } else if (network === "bscTestnet") {
        // On BSC, use the OFT
        localAddress = process.env.FDFI_OFT_BSCTESTNET_ADDRESS || "";
        if (!localAddress) throw new Error("FDFI_OFT_BSCTESTNET_ADDRESS required");
        
        localContract = await ethers.getContractAt("FDFIOFTUpgradeable", localAddress);
        
        // Configure peer to Sepolia
        remoteEid = CHAIN_IDS.sepolia;
        remoteAddress = process.env.FDFI_ADAPTER_ADDRESS || "";
        if (!remoteAddress) throw new Error("FDFI_ADAPTER_ADDRESS required");
        
    } else {
        throw new Error(`Unsupported network: ${network}`);
    }

    console.log("Local contract:", localAddress);
    console.log("Remote EID:", remoteEid);
    console.log("Remote address:", remoteAddress);

    // Convert address to bytes32 format required by LayerZero
    const peerBytes32 = ethers.zeroPadValue(remoteAddress, 32);

    console.log("\nSetting peer...");
    const tx = await localContract.setPeer(remoteEid, peerBytes32);
    await tx.wait();

    console.log("✅ Peer configured successfully!");
    console.log("Transaction hash:", tx.hash);

    // Verify the peer was set
    const setPeer = await localContract.peers(remoteEid);
    console.log("\nVerification - Peer for EID", remoteEid, ":", setPeer);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
