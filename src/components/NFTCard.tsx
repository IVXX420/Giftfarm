import React, { useState, useEffect } from 'react';
import { NFT } from '../types/nft';
import NFTService from '../services/nft';

interface NFTCardProps {
  nft: NFT;
  onBalanceUpdate: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onBalanceUpdate }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStaking, setIsStaking] = useState<boolean>(nft.isStaking);
  const [accumulatedGift, setAccumulatedGift] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      if (isStaking) {
        const now = Date.now();
        const endTime = nft.stakingStartTime + (12 * 60 * 60 * 1000); // 12 часов в миллисекундах
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(remaining);

        // Обновляем накопленные GIFT
        NFTService.getAccumulatedGift(nft.address).then(amount => {
          setAccumulatedGift(amount);
        });

        if (remaining <= 0) {
          setIsStaking(false);
        }
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [isStaking, nft.stakingStartTime, nft.address]);

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartFarming = async () => {
    try {
      setIsLoading(true);
      await NFTService.startFarming(nft.address);
      setIsStaking(true);
      onBalanceUpdate();
    } catch (error) {
      console.error('Ошибка при старте фарминга:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectReward = async () => {
    try {
      setIsLoading(true);
      await NFTService.collectReward(nft.address);
      setIsStaking(false);
      setAccumulatedGift(0);
      onBalanceUpdate();
    } catch (error) {
      console.error('Ошибка при сборе наград:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pb-[100%] mb-3 overflow-hidden rounded-md">
        <img 
          src={nft.metadata.image} 
          alt={nft.metadata.name} 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {isStaking && timeLeft > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            Фарминг
          </div>
        )}
      </div>
      
      <h3 className="text-base font-bold mb-2 truncate text-gray-800">{nft.metadata.name}</h3>
      
      {!isStaking && timeLeft === 0 && (
        <button
          onClick={handleStartFarming}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-3 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Запуск...
            </span>
          ) : 'Начать фарм'}
        </button>
      )}

      {isStaking && timeLeft > 0 && (
        <div className="text-center py-1">
          <p className="text-gray-600 text-sm mb-1">До окончания фарма:</p>
          <p className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm text-gray-700">
            Накоплено GIFT: <span className="font-bold text-green-600">{accumulatedGift.toFixed(3)}</span>
          </p>
        </div>
      )}

      {isStaking && timeLeft === 0 && (
        <button
          onClick={handleCollectReward}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-3 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сбор...
            </span>
          ) : `Собрать ${accumulatedGift.toFixed(3)} GIFT`}
        </button>
      )}
    </div>
  );
};

export default NFTCard; 