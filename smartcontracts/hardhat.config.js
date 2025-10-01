require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/celo_sepolia",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 11142220
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL || "https://celo-json-rpc.stakely.io",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 42220,
      gasPrice: "auto",
      gas: "auto"
    }
  },
  etherscan: {
    apiKey: process.env.CELOSCAN_API_KEY || "dummy",
    customChains: [
      {
        network: "sepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.celoscan.io/api",
          browserURL: "https://sepolia.celoscan.io"
        }
      },
      {
        network: "mainnet",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io"
        }
      }
    ]
  }
};