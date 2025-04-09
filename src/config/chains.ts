import { defineChain } from 'viem';

export const chilizTestnet = defineChain({
  id: 88882,
  name: 'Chiliz Scoville Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Chiliz',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: { http: ['https://scoville-rpc.chiliz.com'] },
  },
  blockExplorers: {
    default: { name: 'ScovilleExplorer', url: 'https://scoville-explorer.chiliz.com/' },
  },
});