import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Celo Sepolia testnet configuration
const celoSepolia = {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/celo_sepolia'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://sepolia.celoscan.io' },
  },
  testnet: true,
} as const;

// Celo Mainnet configuration
const celoMainnet = {
  id: 42220,
  name: 'Celo Mainnet',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://celo-json-rpc.stakely.io'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://celoscan.io' },
  },
  testnet: false,
} as const;

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = getDefaultConfig({
  appName: 'CeloSoul',
  projectId,
  chains: [celoMainnet, celoSepolia],
  ssr: false,
});
