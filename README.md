# Governance Example

This repository contains a Next.js application that interacts with a Governance smart contract deployed on an Ethereum network.

## Install dependencies for the main project:
   ```bash
   npm install
   ```

## Install dependencies for the Hardhat project:
   ```bash
   cd hardhat
   npm install
   cd ..
   ```

# Smart Contract Deployment

Note: we are going to use Alchemy to deploy the contract into Sepolia Testnet

## Navigate to the Hardhat directory:
   ```bash
   cd hardhat
   ```

## Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

## Setup your environment variables

```bash
touch .env
```

```
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>
```

## Deploy the Governance contract to Sepolia:
   ```bash
   # In a new terminal
   npx hardhat run scripts/deploySepolia
   ```
   
   Take note of the deployed contract address shown in the console after deployment.

## Environment Configuration

## In the root directory, create a `.env` file:
   ```bash
   touch .env
   ```

## Add the following environment variables to the `.env` file:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
   ```

   Replace `0xYourContractAddressHere` with the address of your deployed Governance contract.

## Running the Next.js Application

## Return to the root directory if you're still in the hardhat folder:
   ```bash
   cd ..
   ```

## Start the development server:
   ```bash
   npm run dev
   ```

## Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `/app`: Contains the Next.js application code
- `/hardhat`: Contains the smart contract code and deployment scripts

## Additional Information

- The application uses TypeChain to generate TypeScript typings for Ethereum contracts
- Make sure your MetaMask or other Ethereum wallet is connected to the same network where you deployed the contract

