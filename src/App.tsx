import React, { useState } from 'react';
import { Trophy, Goal, Star, Coins, Users, Timer, Shirt, Bot, Info, Award, History } from 'lucide-react';
import { WalletButton } from './components/WalletButton';
import { useGameContract, GameStatus } from './hooks/useGameContract';
import { useAccount } from 'wagmi';

type GameMode = {
  name: string;
  price: number;
  players: number;
  icon: React.ReactNode;
  description: string;
};

const GAME_MODES: GameMode[] = [
  {
    name: "Friendly",
    price: 0.25,
    players: 6,
    icon: <Shirt className="w-6 h-6 text-blue-400" />,
    description: "Perfect for casual players"
  },
  {
    name: "Semi-Pro",
    price: 2.5,
    players: 6,
    icon: <Bot className="w-6 h-6 text-yellow-400" />,
    description: "For experienced challengers"
  },
  {
    name: "Champions",
    price: 10,
    players: 8,
    icon: <Trophy className="w-6 h-6 text-purple-400" />,
    description: "Elite competition"
  }
];

const PLAYERS = [
  { name: "R. Carlos", rating: 92, position: "LB", nation: "🇧🇷" },
  { name: "Zidane", rating: 96, position: "CAM", nation: "🇫🇷" },
  { name: "Ronaldo", rating: 94, position: "ST", nation: "🇵🇹" },
  { name: "Messi", rating: 95, position: "RW", nation: "🇦🇷" },
  { name: "Beckham", rating: 93, position: "RM", nation: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Cruyff", rating: 94, position: "CF", nation: "🇳🇱" },
  { name: "Eusébio", rating: 93, position: "ST", nation: "🇵🇹" },
  { name: "Platini", rating: 92, position: "CAM", nation: "🇫🇷" },
];

const RECENT_WINNERS = [
  { address: "0x1234...5678", amount: 79.2, date: "2024-03-15" },
  { address: "0x8765...4321", amount: 158.4, date: "2024-03-14" },
  { address: "0x9876...1234", amount: 237.6, date: "2024-03-13" },
];

const StatusMessage = ({ status, winner }: { status: GameStatus; winner: string | null }) => {
  const messages = {
    idle: "",
    awaiting_confirmation: "Awaiting wallet confirmation...",
    confirming: "Transaction confirmed! Starting round...",
    selecting_winner: "Selecting winner...",
    complete: `Winner: ${winner}`,
  };

  if (status === 'idle') return null;

  const colors = {
    awaiting_confirmation: 'text-blue-400',
    confirming: 'text-blue-400',
    selecting_winner: 'text-yellow-400',
    complete: 'text-green-400',
  };

  return (
    <div className={`text-center font-medium ${colors[status]}`}>
      {messages[status]}
    </div>
  );
};

function App() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GAME_MODES[0]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { isConnected } = useAccount();
  const { status, winner, error, startGame } = useGameContract();
  
  return (
    <div className="min-h-screen bg-[#000020] text-white font-['Inter']">
      {/* Header */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <WalletButton />
      </div>

      {/* Hero Section */}
      <div className="relative champions-bg overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex justify-center items-center gap-6 mb-12">
            <Trophy className="w-16 h-16 text-[#4A90E2]" strokeWidth={1.5} />
            <Goal className="w-24 h-24 text-[#FFD700]" strokeWidth={1.5} />
            <Trophy className="w-16 h-16 text-[#4A90E2]" strokeWidth={1.5} />
          </div>
          
          <div className="max-w-4xl mx-auto premium-card p-8 md:p-12">
            <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
              <span className="shine-text">ShootOut</span>
              <span className="block text-3xl md:text-4xl mt-2 text-slate-400">
                Ultimate Penalty Challenge
              </span>
            </h1>
            
            <p className="text-center text-xl text-slate-300 mb-8">
              Fair and Transparent Betting for Football Fans
            </p>

            {/* Weekly Epoch Jackpot */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold text-center mb-4">Weekly Epoch Jackpot</h2>
              <div className="text-4xl font-bold text-center text-[#FFD700] animate-pulse mb-4">
                1,250 CHZ
              </div>
              <p className="text-center text-slate-300">
                3 winners selected weekly among active players
              </p>
              <p className="text-center text-sm text-slate-400 mt-2">
                0.75% of all bets contribute to the weekly jackpot
              </p>
            </div>

            <StatusMessage status={status} winner={winner} />
            
            {error && (
              <div className="text-red-400 text-center mb-4">
                {error}
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {GAME_MODES.map((mode) => (
                <button
                  key={mode.name}
                  onClick={() => setSelectedMode(mode)}
                  className={`premium-card glow p-6 flex flex-col items-center gap-4 min-w-[200px]
                    ${selectedMode.name === mode.name ? 'border-[#4A90E2]/50' : 'border-slate-700/50'}`}
                >
                  {mode.icon}
                  <div className="text-center">
                    <div className="font-bold text-lg">{mode.name}</div>
                    <div className="text-sm text-slate-400">{mode.description}</div>
                    <div className="text-sm text-slate-400">{mode.players} Players</div>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Coins className="w-4 h-4 text-[#FFD700]" />
                      <span className="font-medium">{mode.price} CHZ</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-12 flex flex-col items-center gap-4">
              <button 
                onClick={() => {
                  if (isConnected) {
                    startGame(selectedMode.price);
                  }
                }}
                disabled={!isConnected || status !== 'idle'}
                className={`premium-card glow px-8 py-4 text-xl font-bold
                           bg-gradient-to-r from-[#4A90E2] to-purple-600
                           hover:from-[#4A90E2]/80 hover:to-purple-500
                           transition-all duration-300
                           ${!isConnected || status !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isConnected ? 'Start Challenge' : 'Connect Wallet to Play'}
              </button>
              <button 
                onClick={() => setShowHowItWorks(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
                How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="py-16 pitch-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="shine-text">Select Your Legend</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PLAYERS.map((player) => (
                <div key={player.name} className="player-card glow hover:border-[#4A90E2]/50">
                  <div className="text-sm text-slate-400">{player.position}</div>
                  <div className="text-4xl my-4">{player.nation}</div>
                  <div className="text-2xl font-bold">{player.name}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-5 h-5 text-[#FFD700]" fill="currentColor" />
                    <span className="font-bold">{player.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Winners */}
          <div className="mt-16 max-w-2xl mx-auto premium-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-[#FFD700]" />
                Recent Winners
              </h3>
              <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <History className="w-4 h-4" />
                View History
              </button>
            </div>
            <div className="space-y-4">
              {RECENT_WINNERS.map((winner, index) => (
                <div key={index} className="flex justify-between items-center text-slate-300">
                  <span>{winner.address}</span>
                  <span className="font-medium text-[#FFD700]">{winner.amount} CHZ</span>
                  <span className="text-sm text-slate-400">{winner.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-2xl mx-auto premium-card p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Timer className="w-8 h-8 text-[#4A90E2] mx-auto mb-2" />
                <div className="font-semibold">Quick Rounds</div>
                <div className="text-sm text-slate-400">60 second decisions</div>
              </div>
              <div>
                <Coins className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
                <div className="font-semibold">Earn $CHZ</div>
                <div className="text-sm text-slate-400">Win tokens & NFTs</div>
              </div>
              <div>
                <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="font-semibold">Weekly Finals</div>
                <div className="text-sm text-slate-400">Compete for glory</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="champions-bg py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Fair Play Guaranteed
          </div>
          <p className="text-lg text-slate-400">
            Powered by Chiliz Chain | Total Transparency
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Weekly tournaments with exclusive NFT rewards
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Platform fee: 1% (0.75% to weekly jackpot, 0.25% platform maintenance)
          </div>
        </div>
      </footer>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="premium-card max-w-2xl w-full p-6 relative">
            <button 
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="space-y-4 text-slate-300">
              <p>1. Choose your game mode and stake amount in CHZ</p>
              <p>2. Select a legendary player to take your penalty kick</p>
              <p>3. Watch the action unfold in real-time with other players</p>
              <p>4. Winner takes the pool (minus 1% platform fee)</p>
              <p>5. Participate in weekly epochs for a chance to win exclusive NFTs</p>
            </div>
            <div className="mt-6 p-4 bg-blue-900/20 rounded-lg">
              <div className="text-center text-sm text-slate-400">
                <p className="mb-2">Platform Fee Distribution:</p>
                <p>• 0.75% contributes to the weekly epoch jackpot</p>
                <p>• 0.25% for platform maintenance and development</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
              <p className="text-center text-sm text-slate-400">
                Powered by Chiliz Chain for total fairness and transparency
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;