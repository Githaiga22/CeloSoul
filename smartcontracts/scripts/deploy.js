const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying CeloSoulPayments with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "CELO");

  // Constructor parameters
  const cusdAddress = process.env.CUSD_ADDRESS;
  const platformFee = ethers.parseEther("0.5"); // 0.5 cUSD

  console.log("cUSD Address:", cusdAddress);
  console.log("Platform Fee:", ethers.formatEther(platformFee), "cUSD");

  // Deploy contract
  const CeloSoulPayments = await ethers.getContractFactory("CeloSoulPayments");
  const contract = await CeloSoulPayments.deploy(cusdAddress, platformFee);
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  
  console.log("CeloSoulPayments deployed to:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    address: contractAddress,
    constructorArgs: [cusdAddress, platformFee.toString()],
    network: "sepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    txHash: contract.deploymentTransaction().hash
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "sepolia.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployments/sepolia.json");
  console.log("\nNext steps:");
  console.log("1. Wait 2-3 minutes for block confirmations");
  console.log("2. Run: npm run verify");
  console.log("3. Contract will be available at:", `https://sepolia.celoscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });