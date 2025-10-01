import { parseUnits, formatUnits } from 'viem';
import { TOKEN_ADDRESSES, CUSD_DECIMALS, CONTRACT_ADDRESSES } from './constants';

export const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const CELOSOUL_PAYMENTS_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'message', type: 'string' }
    ],
    name: 'sendTip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'grossAmount', type: 'uint256' },
    ],
    name: 'tip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'tierId', type: 'uint8' }],
    name: 'purchaseSubscription',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'platformFee',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'hasActiveSubscription',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const SEPOLIA_CHAIN_ID = 11142220;
const MAINNET_CHAIN_ID = 42220;

export function getCUSDAddress(chainId: number): `0x${string}` {
  if (chainId === SEPOLIA_CHAIN_ID) {
    return TOKEN_ADDRESSES.SEPOLIA.cUSD as `0x${string}`;
  }
  return TOKEN_ADDRESSES.MAINNET.cUSD as `0x${string}`;
}

export const CELOSOUL_PAYMENTS_ADDRESS = '0xEc2B9dde309737CCaeC137939aCb4f8524876D1d' as const;

export function getContractAddress(chainId: number): `0x${string}` {
  if (chainId === SEPOLIA_CHAIN_ID) {
    return CELOSOUL_PAYMENTS_ADDRESS;
  }
  return CONTRACT_ADDRESSES.MAINNET.CeloSoulPayments as `0x${string}`;
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  if (chainId === MAINNET_CHAIN_ID) {
    return `https://celoscan.io/tx/${txHash}`;
  }
  return `https://sepolia.celoscan.io/tx/${txHash}`;
}

export function parseCUSD(amount: string): bigint {
  return parseUnits(amount, CUSD_DECIMALS);
}

export function formatCUSD(amount: bigint): string {
  return formatUnits(amount, CUSD_DECIMALS);
}
