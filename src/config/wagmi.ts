import { createConfig, http } from 'wagmi';
import { chilizTestnet } from './chains';

export const config = createConfig({
  chains: [chilizTestnet],
  transports: {
    [chilizTestnet.id]: http('https://scoville-rpc.chiliz.com'),
  },
});