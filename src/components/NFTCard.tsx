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
      className="card-base p-4 hover:scale-[1.02] hover:shadow-xl group bg-black/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pb-[100%] mb-4 overflow-hidden rounded-xl border border-gray-700/50 group-hover:border-blue-400/30 transition-all duration-300">
        <img 
          src={nft.metadata.image} 
          alt={nft.metadata.name} 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-90'
          }`}
        />
        {isStaking && timeLeft > 0 && (
          <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-blue-400/30 backdrop-blur-sm animate-pulse">
            Фарминг
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-base font-bold truncate text-white group-hover:text-blue-400 transition-colors duration-300">
            {nft.metadata.name}
          </h3>
        </div>
      </div>
      
      {!isStaking && timeLeft === 0 && (
        <button
          onClick={handleStartFarming}
          disabled={isLoading}
          className="button-base py-3 px-4 text-sm font-medium w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Запуск...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Начать фарм
            </span>
          )}
        </button>
      )}

      {isStaking && timeLeft > 0 && (
        <div className="space-y-3">
          <div className="bg-blue-900/30 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-sm">До окончания:</p>
              <p className="text-lg font-bold gradient-text animate-pulse">
                {formatTime(timeLeft)}
              </p>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(1 - timeLeft / (12 * 60 * 60 * 1000)) * 100}%` }}
              />
            </div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Накоплено:</p>
              <p className="text-lg font-bold text-blue-400">
                {accumulatedGift.toFixed(3)} GIFT
              </p>
            </div>
          </div>
        </div>
      )}

      {isStaking && timeLeft === 0 && (
        <button
          onClick={handleCollectReward}
          disabled={isLoading}
          className="button-base py-3 px-4 text-sm font-medium w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Сбор...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Собрать {accumulatedGift.toFixed(3)} GIFT
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default NFTCard; 