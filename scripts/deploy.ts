import { ethers, upgrades } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const SEXYToken = await ethers.getContractFactory("SEXYToken");
    const proxy = await upgrades.deployProxy(
        SEXYToken,
        [deployer.address],
        { initializer: "initialize" }
    );
    await proxy.waitForDeployment();

    console.log("SEXYToken proxy deployed at:", await proxy.getAddress());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
