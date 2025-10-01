export const CELO_CHAINS = {
  SEPOLIA: {
    id: 11142220,
    name: 'Celo Sepolia Testnet',
    rpcUrl: 'https://rpc.ankr.com/celo_sepolia',
    blockExplorer: 'https://sepolia.celoscan.io',
  },
  MAINNET: {
    id: 42220,
    name: 'Celo Mainnet',
    rpcUrl: 'https://celo-json-rpc.stakely.io',
    blockExplorer: 'https://celoscan.io',
  },
} as const;

export const TOKEN_ADDRESSES = {
  SEPOLIA: {
    cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  },
  MAINNET: {
    cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    CELO: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  },
} as const;

// Deployed CeloSoulPayments contract
export const CONTRACT_ADDRESSES = {
  SEPOLIA: {
    CeloSoulPayments: '0xEc2B9dde309737CCaeC137939aCb4f8524876D1d',
  },
  MAINNET: {
    CeloSoulPayments: '', // Will be updated after mainnet deployment
  },
} as const;

export const CUSD_DECIMALS = 18;

export const TIP_PRESETS = [1, 5, 10, 25] as const;

export const SCORING_WEIGHTS = {
  profileMatch: 0.35,
  interests: 0.35,
  behavior: 0.2,
  walletSignal: 0.1,
} as const;

export const DEFAULT_INTERESTS = [
  'Travel',
  'Music',
  'Fitness',
  'Food',
  'Art',
  'Technology',
  'Sports',
  'Reading',
  'Gaming',
  'Photography',
  'Cooking',
  'Movies',
  'Hiking',
  'Yoga',
  'Dancing',
  'Crypto',
  'DeFi',
  'NFTs',
] as const;
