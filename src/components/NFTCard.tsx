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
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="relative pb-[100%] mb-4">
        <img 
          src={nft.metadata.image} 
          alt={nft.metadata.name} 
          className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
        />
      </div>
      
      <h3 className="text-lg font-bold mb-3 truncate">{nft.metadata.name}</h3>
      
      {!isStaking && timeLeft === 0 && (
        <button
          onClick={handleStartFarming}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isLoading ? 'Запуск...' : 'Начать фарм'}
        </button>
      )}

      {isStaking && timeLeft > 0 && (
        <div className="text-center py-2">
          <p className="text-gray-600 mb-2">До окончания фарма:</p>
          <p className="text-2xl font-bold mb-3">{formatTime(timeLeft)}</p>
          <p className="text-lg text-gray-700">
            Накоплено GIFT: <span className="font-bold">{accumulatedGift.toFixed(3)}</span>
          </p>
        </div>
      )}

      {isStaking && timeLeft === 0 && (
        <button
          onClick={handleCollectReward}
          disabled={isLoading}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isLoading ? 'Сбор...' : `Собрать ${accumulatedGift.toFixed(3)} GIFT`}
        </button>
      )}
    </div>
  );
};

export default NFTCard; 