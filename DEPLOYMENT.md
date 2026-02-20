# FDFI Token Testnet Deployment Guide

## Architecture

Your setup includes:
1. **FDFIToken** - Main governance token (Sepolia)
2. **FDFIOFTAdapter** - Wraps FDFIToken for LayerZero bridging (Sepolia)
3. **FDFIOFTUpgradeable** - OFT tokens on remote chains (BSC, Base, etc.)

## Prerequisites

✅ All set in your `.env`:
- Private key configured
- RPC endpoints for Sepolia and BSC Testnet
- LayerZero endpoint addresses
- Etherscan API keys for verification

## Step-by-Step Deployment

### Step 1: Deploy FDFIToken on Sepolia (Source Chain)

#### Quick Deploy (Recommended)

Deploy and verify in a single command:

```bash
# Compile contracts
npm run compile

# Deploy and verify in one step
NETWORK=sepolia npm run deploy:verify
```

**Expected Output:**
```
Deployer: 0x77F93e3c90C065CA251343D61C250402381d5820
✅ SEXYToken proxy deployed at: 0x67761525322D5d2c489E75E7E46E295E64f2F082
Implementation address: 0x61e589014312Ed20f96C14fd226811d9751f1A2e

Verifying on-chain state...
  Name: SEXY
  Symbol: SEXY
  
⏳ Waiting 30 seconds for Etherscan to index...

📝 Verifying contracts on Etherscan...
✅ Implementation verified
✅ Proxy already verified

DEPLOYMENT COMPLETE
Proxy Address: 0x67761525322D5d2c489E75E7E46E295E64f2F082
Etherscan: https://sepolia.etherscan.io/address/0x67761525322D5d2c489E75E7E46E295E64f2F082
```

#### Manual Deploy (Alternative)

If you prefer separate steps:

```bash
# 1. Deploy only
NETWORK=sepolia npm run deploy:token

# 2. Add proxy address to .env
echo "FDFI_TOKEN_ADDRESS=0x..." >> .env

# 3. Verify separately
NETWORK=sepolia npm run verify
```

**Action:** Copy the proxy address and add to `.env`:
```
FDFI_TOKEN_ADDRESS=0x67761525322D5d2c489E75E7E46E295E64f2F082
```

### Step 2: Deploy FDFIOFTAdapter on Sepolia

The adapter wraps your token for LayerZero cross-chain functionality.

```bash
NETWORK=sepolia npm run deploy:adapter
```

**Expected Output:**
```
Token address: 0x...
LayerZero Endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
FDFIOFTAdapter deployed at: 0x...
```

**Action:** Copy the adapter address and add to `.env`:
```
FDFI_ADAPTER_ADDRESS=0x...
```

### Step 3: Deploy FDFIOFTUpgradeable on BSC Testnet (Destination Chain)

```bash
NETWORK=bscTestnet npm run deploy:oft
```

**Expected Output:**
```
Network: bscTestnet
LayerZero Endpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f
Implementation deployed at: 0x...
FDFIOFTUpgradeable proxy deployed at: 0x...
```

**Action:** Copy the OFT proxy address and add to `.env`:
```
FDFI_OFT_BSCTESTNET_ADDRESS=0x...
```

### Step 4: Configure LayerZero Peers

Connect the chains by setting peers on both sides.

**On Sepolia (configure peer to BSC):**
```bash
NETWORK=sepolia npm run configure:peers
```

**On BSC Testnet (configure peer to Sepolia):**
```bash
NETWORK=bscTestnet npm run configure:peers
```

**Expected Output (each):**
```
✅ Peer configured successfully!
Transaction hash: 0x...
```

### Step 5: Approve Adapter (On Sepolia)

Before bridging, users need to approve the adapter to spend their FDFI tokens:

```bash
# This would be done by token holders or in your dApp UI
# Example: token.approve(adapterAddress, amount)
```

### Step 6: Test the Bridge (Optional)

Create a test script to send tokens from Sepolia to BSC:

```typescript
// Example bridge operation
const adapter = await ethers.getContractAt("FDFIOFTAdapter", adapterAddress);
const sendParam = {
    dstEid: 40102, // BSC Testnet
    to: ethers.zeroPadValue(recipientAddress, 32),
    amountLD: ethers.parseUnits("100", 18),
    minAmountLD: ethers.parseUnits("100", 18),
    extraOptions: "0x",
    composeMsg: "0x",
    oftCmd: "0x"
};
const [nativeFee] = await adapter.quoteSend(sendParam, false);
await adapter.send(sendParam, { nativeFee, lzTokenFee: 0 }, recipient, { value: nativeFee });
```

## Verification (Optional)

Verify contracts on block explorers:

```bash
# Verify on Sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# Verify on BSC Testnet
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Rate Limiting (Optional)

Configure rate limits to prevent excessive token flow:

```typescript
// On Adapter or OFT
await contract.setRateLimits([{
    dstEid: 40102, // target chain
    limit: ethers.parseUnits("1000000", 18), // 1M tokens
    window: 86400 // 24 hours
}]);
```

## Summary of Networks

| Network | Chain ID (Hardhat) | LayerZero EID | Endpoint |
|---------|-------------------|---------------|----------|
| Sepolia | sepolia | 40161 | 0x6EDCE65403992e310A62460808c4b910D972f10f |
| BSC Testnet | bscTestnet | 40102 | 0x6EDCE65403992e310A62460808c4b910D972f10f |

## Troubleshooting

**Issue:** "FDFI_TOKEN_ADDRESS environment variable required"
- Make sure you've deployed the token first and added its address to `.env`

**Issue:** "Peer configuration failed"
- Ensure both contracts are deployed before configuring peers
- Verify you're using the correct addresses in `.env`

**Issue:** "Transaction underpriced"
- Your RPC might have gas price issues; wait and retry

## Next Steps

1. Enable transfers on FDFIToken: `await token.enableTransfers()`
2. Mint tokens: `await token.mintTo(address, amount)`
3. Set up monitoring for bridge transactions
4. Configure rate limits based on your tokenomics
5. Consider deploying to additional chains (Base, Arbitrum, etc.)
