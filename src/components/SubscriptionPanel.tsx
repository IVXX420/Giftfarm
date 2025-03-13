import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import SubscriptionService from '../services/subscription';

interface SubscriptionPanelProps {
  isSubscribed: boolean;
  totalNFTs: number;
  farmingNFTs: number;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
  onStartAllFarming: () => void;
  onCollectAllRewards: () => void;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({
  isSubscribed,
  totalNFTs,
  farmingNFTs,
  onSubscribe,
  onUnsubscribe,
  onStartAllFarming,
  onCollectAllRewards
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const [isProcessing, setIsProcessing] = useState(false);
  const subscriptionInfo = SubscriptionService.getSubscriptionInfo();

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      const success = await SubscriptionService.subscribe(tonConnectUI);
      if (success) {
        // Обновляем UI после успешной оплаты
        window.location.reload();
      }
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="backdrop-blur-lg bg-white/5 rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2 sm:mb-0">
          Премиум подписка
        </h2>
        {isSubscribed ? (
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Активна
            </span>
            <button
              onClick={onUnsubscribe}
              className="text-[10px] sm:text-xs text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              Отменить
            </button>
          </div>
        ) : (
          <button
            onClick={onSubscribe}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
          >
            Активировать
          </button>
        )}
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs sm:text-sm text-gray-300">Увеличение скорости фарма в 1.5 раза</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs sm:text-sm text-gray-300">Массовый запуск фарма для всех NFT</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-xs sm:text-sm text-gray-300">Массовый сбор наград</span>
        </div>
      </div>

      {isSubscribed && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onStartAllFarming}
            disabled={totalNFTs === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Запустить фарм для всех NFT
          </button>
          <button
            onClick={onCollectAllRewards}
            disabled={farmingNFTs === 0}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Собрать все награды
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPanel; 