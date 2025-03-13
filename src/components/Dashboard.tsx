import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnect } from '../hooks/useTonConnect';
import { useTonConnectUI } from '@tonconnect/ui-react';
import NFTService from '../services/nft';
import SubscriptionService from '../services/subscription';
import { NFT } from '../types/nft';
import NFTCard from './NFTCard';
import SubscriptionPanel from './SubscriptionPanel';
import Logo from './Logo';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { connected, wallet } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [totalGift, setTotalGift] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'farming'>('all');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Загрузка NFT
  const loadNFTs = async () => {
    if (!wallet?.address) return;
    
    try {
      setIsLoading(true);
      console.log('Загрузка NFT для адреса:', wallet.address);
      const userNFTs = await NFTService.getUserNFTs(wallet.address);
      console.log('Загруженные NFT:', userNFTs);
      setNfts(userNFTs);
    } catch (error) {
      console.error('Ошибка при загрузке NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление общего баланса GIFT
  const updateTotalGift = async () => {
    if (!nfts.length) return;
    try {
      // Получаем накопленные GIFT с активных фармов
      const farmingTotal = await Promise.all(
        nfts.map(nft => NFTService.getAccumulatedGift(nft.address))
      );
      // Получаем общий баланс GIFT
      const totalBalance = NFTService.getGiftBalance() + farmingTotal.reduce((sum, amount) => sum + amount, 0);
      setTotalGift(totalBalance);
    } catch (error) {
      console.error('Ошибка при обновлении баланса:', error);
    }
  };

  // Обновление состояния NFT
  const updateNFTState = (nftAddress: string, isStaking: boolean) => {
    setNfts(prevNfts => 
      prevNfts.map(nft => 
        nft.address === nftAddress 
          ? { ...nft, isStaking, stakingStartTime: isStaking ? Date.now() : 0 }
          : nft
      )
    );
  };

  // Подписка на премиум
  const handleSubscribe = async () => {
    try {
      await SubscriptionService.subscribe(tonConnectUI);
      // Обновляем UI после успешной оплаты
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
    }
  };

  // Запуск фарминга для всех NFT
  const handleStartAllFarming = async () => {
    try {
      await NFTService.startAllFarming(nfts);
      // Обновляем только те NFT, которые не были в процессе фарминга
      setNfts(prevNfts => 
        prevNfts.map(nft => {
          const farmingData = NFTService.getFarmingState(nft.address);
          return farmingData?.isStaking
            ? { ...nft, isStaking: true, stakingStartTime: farmingData.startTime }
            : nft;
        })
      );
      updateTotalGift();
    } catch (error) {
      console.error('Ошибка при запуске всех NFT:', error);
    }
  };

  // Сбор наград со всех NFT
  const handleCollectAllRewards = async () => {
    try {
      const totalCollected = await NFTService.collectAllRewards(nfts);
      if (totalCollected > 0) {
        // Обновляем только те NFT, с которых собрали награду
        setNfts(prevNfts => 
          prevNfts.map(nft => {
            const farmingData = NFTService.getFarmingState(nft.address);
            return !farmingData?.isStaking
              ? { ...nft, isStaking: false, stakingStartTime: 0 }
              : nft;
          })
        );
        updateTotalGift();
      }
    } catch (error) {
      console.error('Ошибка при сборе всех наград:', error);
    }
  };

  useEffect(() => {
    if (connected && wallet?.address) {
      console.log('Кошелек подключен:', wallet.address);
      loadNFTs();
      setIsSubscribed(SubscriptionService.isSubscribed());
    } else {
      console.log('Кошелек не подключен');
    }
  }, [connected, wallet?.address]);

  useEffect(() => {
    if (nfts.length > 0) {
      updateTotalGift();
      const interval = setInterval(updateTotalGift, 2000);
      return () => clearInterval(interval);
    }
  }, [nfts]);

  const farmingNFTs = nfts.filter(nft => nft.isStaking);

  const handleConnect = async () => {
    if (isConnecting || connected) return;
    
    try {
      setIsConnecting(true);
      await tonConnectUI.connectWallet();
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка подключения:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      navigate('/');
    } catch (error) {
      console.error('Ошибка отключения:', error);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 animate-gradient">
        <div className="glass-panel p-8 max-w-md w-full hover-scale">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-center gradient-text">
            GIFT Farm
          </h1>
          <p className="text-gray-300 text-center text-lg mb-8 animate-fadeIn delay-200">
            Подключите TON Keeper для доступа к фармингу
          </p>
          <div className="flex justify-center">
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="button-base py-3 px-6 text-lg font-medium w-full max-w-xs hover:shadow-glow"
            >
              {isConnecting ? 'Подключение...' : 'Подключить кошелёк'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-gradient py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-4xl">
        {/* Верхняя панель с логотипом, названием и кошельком */}
        <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo />
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">
                Gift Farm
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-panel px-3 py-1.5">
                <p className="text-xs sm:text-sm font-mono text-gray-300">
                  {wallet?.shortAddress}
                </p>
              </div>
              <button 
                onClick={handleDisconnect}
                className="button-base py-1.5 px-3 text-sm"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Информационные блоки */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-panel p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">Баланс GIFT</p>
            <p className="text-xl font-bold gradient-text">
              {totalGift.toFixed(3)}
              {isSubscribed && <span className="text-xs text-gray-400 block">x1.5 бонус</span>}
            </p>
          </div>
          <div className="glass-panel p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">NFT на фарме</p>
            <p className="text-xl font-bold text-green-400">
              {farmingNFTs.length}
            </p>
          </div>
          <div className="glass-panel p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">Всего NFT</p>
            <p className="text-xl font-bold text-blue-400">
              {nfts.length}
            </p>
          </div>
        </div>

        {/* Панель подписки */}
        <div className="glass-panel p-4 sm:p-6 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold mb-2">
              {isSubscribed ? 'Премиум активен' : 'Получите премиум'}
            </h2>
            <p className="text-sm text-gray-400">
              Увеличьте скорость фарма в 1.5 раза
            </p>
          </div>
          <div className="flex gap-2">
            {!isSubscribed && (
              <button
                onClick={handleSubscribe}
                className="button-base py-2 px-4"
              >
                Купить за 0.1 TON
              </button>
            )}
            <button
              onClick={handleStartAllFarming}
              disabled={!isSubscribed || nfts.length === 0}
              className="button-base py-2 px-4"
            >
              Запустить все
            </button>
            <button
              onClick={handleCollectAllRewards}
              disabled={!isSubscribed || farmingNFTs.length === 0}
              className="button-base py-2 px-4"
            >
              Собрать все
            </button>
          </div>
        </div>

        {/* Список NFT */}
        {isLoading ? (
          <div className="glass-panel p-6 text-center">
            <div className="animate-spin h-12 w-12 mx-auto mb-4">
              {/* Спиннер */}
            </div>
            <p>Загрузка NFT...</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="glass-panel p-6 text-center">
            <p className="text-lg mb-2">У вас нет NFT для фарминга</p>
            <p className="text-sm text-gray-400">Приобретите NFT из поддерживаемых коллекций</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {nfts.map((nft) => (
              <div key={nft.address} className="glass-panel p-4">
                <div className="aspect-square mb-4 bg-gray-800 rounded-lg">
                  {/* Здесь будет изображение NFT */}
                </div>
                <button
                  onClick={() => updateNFTState(nft.address, !nft.isStaking)}
                  className="button-base w-full py-2 mb-2"
                >
                  {nft.isStaking ? 'Собрать' : 'Начать фарм'}
                </button>
                <p className="text-sm text-gray-400 text-center">
                  {nft.isStaking ? 'Фарминг активен' : 'Ожидает фарминга'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 