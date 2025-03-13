import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { NFT } from '../types/nft';
import NFTService from '../services/nft';
import { useBackground } from '../context/BackgroundContext';
import SubscriptionService from '../services/subscription';

interface NFTCardProps {
  nft: NFT;
  onStakeChange: (nftAddress: string, isStaking: boolean) => void;
  onRewardCollect: () => Promise<void>;
  onError?: (error: Error) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onStakeChange, onRewardCollect, onError }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStaking, setIsStaking] = useState<boolean>(nft.isStaking);
  const [accumulatedGift, setAccumulatedGift] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { setBackgroundImage, backgroundImage, sourceNFTAddress, resetBackground } = useBackground();

  useEffect(() => {
    const updateTimer = () => {
      if (isStaking) {
        const now = Date.now();
        const endTime = nft.stakingStartTime + (12 * 60 * 60 * 1000);
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(remaining);

        NFTService.getAccumulatedGift(nft.address)
          .then(amount => {
            setAccumulatedGift(amount);
          })
          .catch(error => {
            console.error('Ошибка при получении накопленных GIFT:', error);
            onError?.(error);
          });

        if (remaining <= 0) {
          setIsStaking(false);
          onRewardCollect();
        }
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [isStaking, nft.stakingStartTime, nft.address, onRewardCollect, onError]);

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
      onStakeChange(nft.address, true);
      toast.success(`Фарминг ${nft.metadata.name} запущен! 🚀`, {
        theme: 'dark',
      });
    } catch (error) {
      console.error('Ошибка при старте фарминга:', error);
      toast.error(`Ошибка при запуске фарминга ${nft.metadata.name} 😕`, {
        theme: 'dark',
      });
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectReward = async () => {
    try {
      setIsLoading(true);
      await NFTService.collectReward(nft.address);
      setIsStaking(false);
      onStakeChange(nft.address, false);
      onRewardCollect();
      setAccumulatedGift(0);
      toast.success(`Собрано ${accumulatedGift.toFixed(3)} GIFT с ${nft.metadata.name}! 🎁`, {
        theme: 'dark',
      });
    } catch (error) {
      console.error('Ошибка при сборе наград:', error);
      toast.error(`Ошибка при сборе наград с ${nft.metadata.name} 😕`, {
        theme: 'dark',
      });
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetBackground = async () => {
    try {
      if (!SubscriptionService.isPremium()) {
        toast.error('Смена фона доступна только для премиум пользователей! 💎', {
          theme: 'dark',
        });
        return;
      }

      setIsLoading(true);
      console.log('Начинаем получение фона для NFT:', nft);
      const background = await NFTService.getNFTBackground(nft);
      console.log('Полученный фон:', background);
      
      if (background.color || background.pattern || background.image) {
        setBackgroundImage(background, nft.address);
        toast.success('Фон успешно установлен');
      } else {
        toast.warning('Не удалось определить фон для этого NFT');
      }
    } catch (error) {
      console.error('Ошибка при установке фона:', error);
      toast.error('Ошибка при установке фона');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetBackground = () => {
    if (!SubscriptionService.isPremium()) {
      toast.error('Смена фона доступна только для премиум пользователей! 💎', {
        theme: 'dark',
      });
      return;
    }

    resetBackground();
    toast.success('Фон сброшен! 🔄', {
      theme: 'dark',
    });
  };

  return (
    <div 
      className="backdrop-blur-lg bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pb-[100%] overflow-hidden group">
        <img 
          src={nft.metadata.image} 
          alt={nft.metadata.name} 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-90'
          }`}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-bold truncate text-white group-hover:text-blue-400 transition-colors duration-300">
              {nft.metadata.name}
            </h3>
            {isStaking && timeLeft > 0 && (
              <div className="backdrop-blur-md bg-black/50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-blue-400 border border-blue-400/30">
                Фарминг
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-2">
          {SubscriptionService.isPremium() ? (
            <>
              <button
                onClick={handleSetBackground}
                className="backdrop-blur-md bg-black/50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-purple-400 border border-purple-400/30 hover:bg-purple-400/20 transition-all duration-300"
              >
                Выбрать фон
              </button>
              {backgroundImage && sourceNFTAddress === nft.address && (
                <button
                  onClick={handleResetBackground}
                  className="backdrop-blur-md bg-black/50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-red-400 border border-red-400/30 hover:bg-red-400/20 transition-all duration-300"
                >
                  Убрать фон
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => toast.error('Смена фона доступна только для премиум пользователей! 💎', { theme: 'dark' })}
              className="backdrop-blur-md bg-black/50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-400 border border-gray-400/30 hover:bg-gray-400/20 transition-all duration-300"
            >
              Премиум функция
            </button>
          )}
        </div>
      </div>
      
      {!isStaking && timeLeft === 0 && (
        <div className="p-3 sm:p-4">
          <button
            onClick={handleStartFarming}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium w-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse text-xs sm:text-sm">Запуск...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Начать фарм
              </span>
            )}
          </button>
        </div>
      )}

      {isStaking && timeLeft > 0 && (
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="backdrop-blur-md bg-black/30 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <p className="text-xs sm:text-sm text-gray-400">До окончания:</p>
              <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text animate-pulse">
                {formatTime(timeLeft)}
              </p>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1 sm:h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 sm:h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(1 - timeLeft / (12 * 60 * 60 * 1000)) * 100}%` }}
              />
            </div>
          </div>
          <div className="backdrop-blur-md bg-black/30 rounded-xl p-2.5 sm:p-3 border border-white/5">
            <div className="flex justify-between items-center">
              <p className="text-xs sm:text-sm text-gray-400">Накоплено:</p>
              <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                {accumulatedGift.toFixed(3)} GIFT
              </p>
            </div>
          </div>
        </div>
      )}

      {isStaking && timeLeft === 0 && (
        <div className="p-3 sm:p-4">
          <button
            onClick={handleCollectReward}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium w-full hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse text-xs sm:text-sm">Сбор...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Собрать {accumulatedGift.toFixed(3)} GIFT
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default NFTCard; 