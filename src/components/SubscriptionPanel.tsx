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
    <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-2">
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
            className="button-base py-2 px-4 sm:px-6 text-sm sm:text-base mt-2 sm:mt-0 w-full sm:w-auto hover:shadow-glow"
          >
            {isProcessing ? 'Обработка...' : 'Купить за 1 TON'}
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          onClick={onStartAllFarming}
          disabled={totalNFTs === 0 || farmingCount === totalNFTs}
          className={`button-base py-2 px-4 text-sm flex-1 ${
            (!isSubscribed || totalNFTs === 0 || farmingCount === totalNFTs)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-glow'
          }`}
        >
          Запустить все
        </button>
        <button
          onClick={onCollectAllRewards}
          disabled={farmingCount === 0}
          className={`button-base py-2 px-4 text-sm flex-1 ${
            (!isSubscribed || farmingCount === 0)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-glow'
          }`}
        >
          Собрать все
        </button>
      </div>

      {!isSubscribed && (
        <div className="mt-4 p-3 glass-panel bg-opacity-50">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            Преимущества премиума:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Скорость фарма увеличена в 1.5 раза</li>
            <li>• Возможность запускать и собирать фарм со всех NFT одной кнопкой</li>
            <li>• Доступ к эксклюзивным коллекциям</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPanel; 