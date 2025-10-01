const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [sender] = await ethers.getSigners();
  
  // Load deployment
  const deploymentPath = path.join(__dirname, "..", "deployments", "alfajores.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  
  // Contract instances
  const contract = await ethers.getContractAt("CeloSoulPayments", deployment.address);
  const cusd = await ethers.getContractAt("IERC20", process.env.CUSD_ADDRESS);
  
  console.log("Testing CeloSoulPayments at:", deployment.address);
  console.log("Sender:", sender.address);
  
  // Check cUSD balance
  const balance = await cusd.balanceOf(sender.address);
  console.log("cUSD Balance:", ethers.formatEther(balance));
  
  if (balance < ethers.parseEther("1")) {
    console.log("⚠️  Low cUSD balance. Get testnet cUSD from: https://faucet.celo.org");
    return;
  }
  
  // Example: Set up a subscription tier (owner only)
  console.log("\n1. Setting up subscription tier...");
  const tierPrice = ethers.parseEther("5"); // 5 cUSD
  const tierDuration = 30 * 24 * 60 * 60; // 30 days
  
  try {
    const tx1 = await contract.setTier(1, tierPrice, tierDuration);
    await tx1.wait();
    console.log("✅ Tier 1 set: 5 cUSD for 30 days");
  } catch (error) {
    console.log("❌ Failed to set tier (you might not be owner)");
  }
  
  // Example: Approve and tip
  console.log("\n2. Testing tip function...");
  const tipAmount = ethers.parseEther("1"); // 1 cUSD tip
  const recipient = "0x742d35Cc6634C0532925a3b8D4C9db96590C6C87"; // Example address
  
  try {
    // Approve
    const approveTx = await cusd.approve(deployment.address, tipAmount);
    await approveTx.wait();
    console.log("✅ Approved", ethers.formatEther(tipAmount), "cUSD");
    
    // Tip
    const tipTx = await contract.tip(recipient, tipAmount);
    await tipTx.wait();
    console.log("✅ Tip sent to", recipient);
    
  } catch (error) {
    console.log("❌ Tip failed:", error.message);
  }
  
  // Example: Purchase subscription
  console.log("\n3. Testing subscription purchase...");
  try {
    // Approve for subscription
    const approveTx2 = await cusd.approve(deployment.address, tierPrice);
    await approveTx2.wait();
    
    // Purchase
    const subTx = await contract.purchaseSubscription(1);
    await subTx.wait();
    console.log("✅ Subscription purchased");
    
    // Check subscription status
    const hasActive = await contract.hasActiveSubscription(sender.address);
    const expiry = await contract.subscriptionExpiryOf(sender.address);
    console.log("Active subscription:", hasActive);
    console.log("Expires:", new Date(Number(expiry) * 1000).toLocaleString());
    
  } catch (error) {
    console.log("❌ Subscription purchase failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });