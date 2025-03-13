import React from 'react';

interface StatsPanelProps {
  totalGift: number;
  totalNFTs: number;
  farmingNFTs: number;
  isSubscribed: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  totalGift,
  totalNFTs,
  farmingNFTs,
  isSubscribed
}) => {
  return (
    <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8 hover-scale">
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        <div className="glass-panel p-2 sm:p-4 text-center hover-scale">
          <p className="text-xs sm:text-sm text-gray-400 mb-0.5 sm:mb-1">Баланс GIFT</p>
          <div className="flex flex-col">
            <p className="text-lg sm:text-2xl font-bold gradient-text animate-pulse">
              {totalGift.toFixed(3)}
            </p>
            <p className="text-xs text-gray-400">
              {isSubscribed ? 'x1.5 бонус активен' : ''}
            </p>
          </div>
        </div>
        <div className="glass-panel p-2 sm:p-4 text-center hover-scale">
          <p className="text-xs sm:text-sm text-gray-400 mb-0.5 sm:mb-1">Всего NFT</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-400">
            {totalNFTs}
          </p>
        </div>
        <div className="glass-panel p-2 sm:p-4 text-center hover-scale">
          <p className="text-xs sm:text-sm text-gray-400 mb-0.5 sm:mb-1">Фармится</p>
          <p className="text-lg sm:text-2xl font-bold text-green-400">
            {farmingNFTs}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 