const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Load deployment info
  const deploymentPath = path.join(__dirname, "..", "deployments", "sepolia.json");
  
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  
  console.log("Verifying contract at:", deployment.address);
  console.log("Constructor args:", deployment.constructorArgs);

  try {
    await run("verify:verify", {
      address: deployment.address,
      constructorArguments: deployment.constructorArgs,
    });
    
    console.log("Contract verified successfully!");
    console.log("View on Celoscan:", `https://sepolia.celoscan.io/address/${deployment.address}`);
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified!");
    } else {
      console.error("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });