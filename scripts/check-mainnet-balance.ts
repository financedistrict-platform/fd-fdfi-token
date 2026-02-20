import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const address = "0x967b148c65A6788188eDBE5656c544E7667b022a";

  const networks = [
    { 
      name: "Ethereum Mainnet", 
      rpc: process.env.MAINNET_ETHEREUM_RPC_URL || ""
    },
    { 
      name: "Base Mainnet", 
      rpc: process.env.MAINNET_BASE_RPC_URL || ""
    },
    { 
      name: "BSC Mainnet", 
      rpc: process.env.MAINNET_BSC_RPC_URL || ""
    },
    { 
      name: "Arbitrum Mainnet", 
      rpc: process.env.MAINNET_ARBITRUM_RPC_URL || ""
    }
  ];

  console.log(`Wallet: ${address}`);
  console.log("");

  for (const network of networks) {
    try {
      const provider = new ethers.JsonRpcProvider(network.rpc);
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balance);
      console.log(`${network.name.padEnd(20)} ${ethBalance} ETH`);
    } catch (error: any) {
      console.log(`${network.name.padEnd(20)} Error: ${error.message}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
