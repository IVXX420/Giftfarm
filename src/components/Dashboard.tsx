import React, { useState, useEffect } from 'react';
import { useTonConnect } from '../hooks/useTonConnect';
import NFTService from '../services/nft';
import { NFT } from '../types/nft';
import NFTCard from './NFTCard';

const Dashboard: React.FC = () => {
  const { connected, wallet } = useTonConnect();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [totalGift, setTotalGift] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'farming'>('all');

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
      const total = await Promise.all(
        nfts.map(nft => NFTService.getAccumulatedGift(nft.address))
      );
      setTotalGift(total.reduce((sum, amount) => sum + amount, 0));
    } catch (error) {
      console.error('Ошибка при обновлении баланса:', error);
    }
  };

  useEffect(() => {
    if (connected && wallet?.address) {
      console.log('Кошелек подключен:', wallet.address);
      loadNFTs();
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

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-black animate-gradient">
        <div className="card-base p-8 max-w-md w-full hover:scale-[1.02] hover:shadow-2xl animate-fadeIn bg-black/30">
          <div className="flex justify-center mb-8">
            <img src="/gift-logo.png" alt="GIFT Farm" className="h-24 w-24 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-center gradient-text animate-pulse">
            GIFT Farm
          </h1>
          <p className="text-gray-300 text-center text-lg mb-8 animate-fadeIn delay-200">
            Подключите TON Keeper для доступа к фармингу
          </p>
          <div className="flex justify-center">
            <button className="button-base py-3 px-6 text-lg font-medium">
              Подключить кошелёк
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black animate-gradient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Верхняя панель */}
        <div className="card-base p-6 mb-8 hover:shadow-2xl animate-fadeIn bg-black/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img src="/gift-logo.png" alt="GIFT Farm" className="h-12 w-12 mr-4" />
              <h1 className="text-3xl font-bold gradient-text">
                GIFT Farm
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Ваш адрес</p>
                <p className="text-gray-300 font-mono">{wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}</p>
              </div>
              <button className="button-base py-2 px-4">
                Выйти
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="card-base bg-blue-900/30 p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Баланс GIFT</p>
              <p className="text-2xl font-bold gradient-text animate-pulse">
                {totalGift.toFixed(3)}
              </p>
            </div>
            <div className="card-base bg-blue-900/30 p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Всего NFT</p>
              <p className="text-2xl font-bold text-blue-400">
                {nfts.length}
              </p>
            </div>
            <div className="card-base bg-blue-900/30 p-4 text-center">
              <p className="text-gray-400 text-sm mb-1">Фармится</p>
              <p className="text-2xl font-bold text-green-400">
                {farmingNFTs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="flex space-x-4 mb-6">
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              selectedTab === 'all' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
            onClick={() => setSelectedTab('all')}
          >
            Все NFT ({nfts.length})
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              selectedTab === 'farming' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
            }`}
            onClick={() => setSelectedTab('farming')}
          >
            Фармятся ({farmingNFTs.length})
          </button>
        </div>

        {/* Загрузка */}
        {isLoading && (
          <div className="card-base p-12 text-center animate-fadeIn bg-black/30">
            <div className="inline-block animate-bounce">
              <svg className="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-300 mt-6 text-lg animate-pulse">Загрузка NFT...</p>
          </div>
        )}

        {/* Пустое состояние */}
        {!isLoading && nfts.length === 0 && (
          <div className="card-base p-12 text-center animate-fadeIn bg-black/30">
            <svg className="mx-auto h-24 w-24 text-gray-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-300 mt-6 text-xl">
              У вас нет NFT, подходящих для фарминга
            </p>
            <p className="text-gray-500 mt-2">
              Приобретите NFT из поддерживаемых коллекций
            </p>
          </div>
        )}

        {/* Список NFT */}
        {!isLoading && nfts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedTab === 'all' ? nfts : farmingNFTs).map((nft, index) => (
              <div key={nft.address} 
                className="animate-fadeIn" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <NFTCard 
                  nft={nft} 
                  onBalanceUpdate={updateTotalGift}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 