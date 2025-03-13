import React, { useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import SubscriptionService from '../services/subscription';

interface SubscriptionPanelProps {
  isSubscribed: boolean;
  onSubscribe: () => void;
  onStartAllFarming: () => void;
  onCollectAllRewards: () => void;
  farmingCount: number;
  totalNFTs: number;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({
  isSubscribed,
  onStartAllFarming,
  onCollectAllRewards,
  farmingCount,
  totalNFTs
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
    <div className="backdrop-blur-lg bg-white/5 rounded-2xl border border-white/10 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-2">
            {isSubscribed ? 'Премиум активен' : 'Получите премиум'}
          </h2>
          {isSubscribed && subscriptionInfo ? (
            <p className="text-sm text-gray-400">
              Действует до {formatDate(subscriptionInfo.expiresAt)}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Увеличьте скорость фарма в 1.5 раза
            </p>
          )}
        </div>
        {!isSubscribed && (
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 sm:mt-0 w-full sm:w-auto"
          >
            {isProcessing ? 'Обработка...' : 'Купить за 0.1 TON'}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onStartAllFarming}
          disabled={totalNFTs === 0 || farmingCount === totalNFTs}
          className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            (!isSubscribed || totalNFTs === 0 || farmingCount === totalNFTs)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Запустить все
        </button>
        <button
          onClick={onCollectAllRewards}
          disabled={farmingCount === 0}
          className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex-1 disabled:opacity-50 disabled:cursor-not-allowed ${
            (!isSubscribed || farmingCount === 0)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Собрать все
        </button>
      </div>

      {!isSubscribed && (
        <div className="mt-6 backdrop-blur-md bg-black/30 rounded-xl p-4 border border-white/5">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Преимущества премиума:
          </h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Скорость фарма увеличена в 1.5 раза
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Возможность запускать и собирать фарм со всех NFT одной кнопкой
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              Доступ к эксклюзивным коллекциям
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPanel; 