import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther } from 'viem';

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: injected(),
  });
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({
    address,
  });

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="text-slate-400">Balance: </span>
          <span className="font-medium text-[#FFD700]">
            {balance ? `${Number(formatEther(balance.value)).toFixed(4)} CHZ` : '0 CHZ'}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect()}
      className="px-4 py-2 text-sm font-medium text-white bg-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/80 transition-colors"
    >
      Connect Wallet
    </button>
  );
}