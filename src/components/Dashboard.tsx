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

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 to-black animate-gradient">
        <div className="card-base p-8 max-w-md w-full hover:scale-[1.02] hover:shadow-2xl animate-fadeIn">
          <h1 className="text-3xl font-bold mb-6 text-center gradient-text animate-pulse">
            Подключите кошелёк TON
          </h1>
          <p className="text-gray-300 text-center text-lg animate-fadeIn delay-200">
            Для доступа к функционалу фарминга необходимо подключить кошелёк TON Keeper
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black animate-gradient">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Заголовок и баланс */}
        <div className="card-base p-6 mb-6 hover:shadow-2xl animate-fadeIn">
          <h1 className="text-2xl font-bold mb-4 gradient-text animate-pulse">
            Фарминг GIFT
          </h1>
          <div className="flex items-center justify-between">
            <div className="animate-fadeIn delay-100">
              <p className="text-gray-300">Ваш баланс GIFT:</p>
              <p className="text-3xl font-bold gradient-text">
                {totalGift.toFixed(3)}
              </p>
            </div>
            {nfts.length > 0 && (
              <div className="bg-gray-700/50 rounded-xl px-4 py-2 border border-gray-600/50 animate-fadeIn delay-200">
                <p className="text-gray-300 font-medium">
                  Доступно NFT: <span className="text-xl font-bold text-blue-400">{nfts.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Загрузка */}
        {isLoading && (
          <div className="text-center py-8 animate-fadeIn">
            <div className="inline-block animate-bounce">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-300 mt-4 animate-pulse">Загрузка NFT...</p>
          </div>
        )}

        {/* Список NFT */}
        {!isLoading && nfts.length === 0 && (
          <div className="card-base text-center py-8 p-6 animate-fadeIn">
            <svg className="mx-auto h-12 w-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-300 mt-4">
              У вас нет NFT, подходящих для фарминга
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {nfts.map((nft, index) => (
            <div key={nft.address} className={`animate-fadeIn`} style={{ animationDelay: `${index * 150}ms` }}>
              <NFTCard 
                nft={nft} 
                onBalanceUpdate={updateTotalGift}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 