import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

export type GameStatus = 'idle' | 'awaiting_confirmation' | 'confirming' | 'selecting_winner' | 'complete';

export function useGameContract() {
  const { address } = useAccount();
  const [status, setStatus] = useState<GameStatus>('idle');
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: hash, writeContract } = useWriteContract();
  
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
    onSuccess: () => {
      setStatus('selecting_winner');
      // Simulate winner selection after 2 seconds
      setTimeout(() => {
        // For testing, 50% chance the current user wins
        const hasWon = Math.random() > 0.5;
        setWinner(hasWon ? address! : '0x1234...5678');
        setStatus('complete');
      }, 2000);
    },
  });

  const startGame = async (amount: number) => {
    try {
      setStatus('awaiting_confirmation');
      setError(null);
      setWinner(null);

      // For testing purposes, we're using a direct transfer
      // In production, this would be a contract interaction
      await writeContract({
        address: '0x0000000000000000000000000000000000000000', // Replace with actual contract
        abi: [{
          name: 'startGame',
          type: 'function',
          stateMutability: 'payable',
          inputs: [],
          outputs: [],
        }],
        functionName: 'startGame',
        value: parseEther(amount.toString()),
      });

      setStatus('confirming');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
      setStatus('idle');
    }
  };

  return {
    status,
    winner,
    error,
    isConfirming,
    startGame,
  };
}