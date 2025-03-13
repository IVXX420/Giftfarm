import React, { useState } from 'react';
import { useTonConnect } from '../hooks/useTonConnect';

interface SubscriptionPanelProps {
  isSubscribed: boolean;
  onSubscribe: () => Promise<void>;
  onStartAllFarming: () => Promise<void>;
  onCollectAllRewards: () => Promise<void>;
  farmingCount: number;
  totalNFTs: number;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({
  isSubscribed,
  onSubscribe,
  onStartAllFarming,
  onCollectAllRewards,
  farmingCount,
  totalNFTs
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { wallet } = useTonConnect();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      await onSubscribe();
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAll = async () => {
    try {
      setIsLoading(true);
      await onStartAllFarming();
    } catch (error) {
      console.error('Ошибка при запуске всех NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectAll = async () => {
    try {
      setIsLoading(true);
      await onCollectAllRewards();
    } catch (error) {
      console.error('Ошибка при сборе всех наград:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet?.address) return null;

  return (
    <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
            {isSubscribed ? 'Премиум подписка активна' : 'Получите премиум доступ'}
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-4">
            {isSubscribed 
              ? 'У вас активирована премиум подписка. Наслаждайтесь повышенной скоростью фарминга и дополнительными возможностями!' 
              : 'Активируйте премиум подписку для увеличения скорости фарма в 1.5 раза и управления всеми NFT одной кнопкой'}
          </p>
          {!isSubscribed && (
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="button-base py-2 px-6 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            >
              {isLoading ? 'Активация...' : 'Активировать подписку'}
            </button>
          )}
        </div>
        
        {isSubscribed && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleStartAll}
              disabled={isLoading || farmingCount === totalNFTs}
              className={`button-base py-2 px-4 text-sm sm:text-base flex-1 sm:flex-none ${
                farmingCount === totalNFTs
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-glow'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Запустить все
              </span>
            </button>
            <button
              onClick={handleCollectAll}
              disabled={isLoading || farmingCount === 0}
              className={`button-base py-2 px-4 text-sm sm:text-base flex-1 sm:flex-none ${
                farmingCount === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Собрать все
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPanel; 