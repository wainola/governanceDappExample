import { ethers } from "hardhat";
import { Governance__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Get the private key from environment variables
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing PRIVATE_KEY environment variable");
  }

  // Get the Alchemy API key from environment variables
  const alchemyApiKey = process.env.ALCHEMY_API_KEY;
  if (!alchemyApiKey) {
    throw new Error("Missing ALCHEMY_API_KEY environment variable");
  }

  console.log("Deploying Governance contract to Sepolia...");

  // Connect to the Sepolia network
  const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
  const wallet = new ethers.Wallet(privateKey, provider);
  
  // Get the contract factory
  const GovernanceFactory = new Governance__factory(wallet);
  
  // Deploy the contract
  const governance = await GovernanceFactory.deploy();
  await governance.waitForDeployment();
  
  const governanceAddress = await governance.getAddress();
  console.log(`Governance deployed to: ${governanceAddress}`);
  
  console.log("Deployment complete!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
