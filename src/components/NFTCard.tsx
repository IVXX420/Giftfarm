import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface NFTCardProps {
  name: string;
  image: string;
  collection: string;
  isFarming: boolean;
  farmingEndTime?: number;
  onStartFarming: () => Promise<void>;
  onCollectReward: () => Promise<void>;
}

const NFTCard: React.FC<NFTCardProps> = ({
  name,
  image,
  collection,
  isFarming,
  farmingEndTime,
  onStartFarming,
  onCollectReward,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isFarming && farmingEndTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const difference = farmingEndTime - now;

        if (difference <= 0) {
          setTimeLeft('Готово!');
          clearInterval(timer);
          return;
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isFarming, farmingEndTime]);

  const handleStartFarming = async () => {
    try {
      setIsLoading(true);
      await onStartFarming();
      toast.success('Фарминг успешно запущен! 🚀', {
        className: 'toast-base animate-fade-in-up',
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      console.error('Ошибка при запуске фарминга:', error);
      toast.error('Ошибка при запуске фарминга 😢', {
        className: 'toast-base animate-fade-in-up',
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectReward = async () => {
    try {
      setIsLoading(true);
      await onCollectReward();
      toast.success('Награда успешно собрана! 🎁', {
        className: 'toast-base animate-fade-in-up',
        position: 'top-right',
        autoClose: 3000
      });
    } catch (error) {
      console.error('Ошибка при сборе награды:', error);
      toast.error('Ошибка при сборе награды 😢', {
        className: 'toast-base animate-fade-in-up',
        position: 'top-right',
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className="card-hover glass-panel p-4 rounded-xl overflow-hidden relative group"
      role="article"
      aria-label={`NFT карточка: ${name}`}
    >
      {/* Фоновое изображение с градиентом */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{ backgroundImage: imageError ? 'none' : `url(${image})` }}
      />
      
      {/* Градиентный оверлей */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900/80" />

      {/* Контент */}
      <div className="relative z-10">
        {/* Заголовок */}
        <h3 className="text-xl font-bold mb-2 text-white animate-fade-in-up">
          {name}
        </h3>

        {/* Коллекция */}
        <p className="text-gray-400 text-sm mb-4 animate-fade-in-up delay-100">
          {collection}
        </p>

        {/* Изображение NFT */}
        <div className="relative mb-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {!imageError ? (
            <img 
              src={image} 
              alt={`NFT изображение: ${name}`}
              className="w-full h-48 object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Прогресс-бар фарминга */}
        {isFarming && farmingEndTime && (
          <div className="mb-4">
            <div className="progress-bar" role="progressbar" aria-valuenow={((Date.now() - (farmingEndTime - 12 * 60 * 60 * 1000)) / (12 * 60 * 60 * 1000)) * 100} aria-valuemin={0} aria-valuemax={100}>
              <div 
                className="progress-bar-fill animate-pulse"
                style={{ 
                  width: `${((Date.now() - (farmingEndTime - 12 * 60 * 60 * 1000)) / (12 * 60 * 60 * 1000)) * 100}%`
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-2 animate-pulse">
              Осталось: {timeLeft}
            </p>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex gap-2">
          {!isFarming ? (
            <button
              onClick={handleStartFarming}
              disabled={isLoading}
              className="button-base ripple-effect flex-1 py-2 text-sm font-medium"
              aria-label="Начать фарминг"
            >
              {isLoading ? 'Запуск...' : 'Начать фарм'}
            </button>
          ) : (
            <button
              onClick={handleCollectReward}
              disabled={isLoading || timeLeft !== 'Готово!'}
              className="button-base ripple-effect flex-1 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Собрать награду"
            >
              {isLoading ? 'Сбор...' : 'Собрать награду'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard; 