import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.27",
        settings: {
            optimizer: { enabled: true, runs: 200 }
        }
    },
    networks: {
        localhost: {},
        // Testnet networks
        sepolia: {
            url: process.env.TESTNET_SEPOLIA_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        baseSepolia: {
            url: process.env.TESTNET_BASE_SEPOLIA_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        bscTestnet: {
            url: process.env.TESTNET_BSC_TESTNET_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        arbitrumSepolia: {
            url: process.env.TESTNET_ARBITRUM_SEPOLIA_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        // Mainnet networks (for future production deployment)
        mainnet: {
            url: process.env.MAINNET_ETHEREUM_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        base: {
            url: process.env.MAINNET_BASE_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        bsc: {
            url: process.env.MAINNET_BSC_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        },
        arbitrum: {
            url: process.env.MAINNET_ARBITRUM_RPC_URL || "",
            accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : []
        }
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || "",
        customChains: [
            {
                network: "bscTestnet",
                chainId: 97,
                urls: {
                    apiURL: "https://api-testnet.bscscan.com/api",
                    browserURL: "https://testnet.bscscan.com"
                }
            }
        ]
    },
    sourcify: {
        enabled: false
    }
};

export default config;
