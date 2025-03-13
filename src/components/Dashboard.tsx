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
      setNfts(userNFTs);
    } catch (error) {
      console.error('Ошибка при загрузке NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление общего баланса GIFT
  const updateTotalGift = async () => {
    const total = await Promise.all(
      nfts.map(nft => NFTService.getAccumulatedGift(nft.address))
    );
    setTotalGift(total.reduce((sum, amount) => sum + amount, 0));
  };

  // Загрузка NFT при подключении кошелька
  useEffect(() => {
    if (connected && wallet?.address) {
      loadNFTs();
    }
  }, [connected, wallet?.address]);

  // Обновление баланса каждые 2 секунды
  useEffect(() => {
    if (nfts.length > 0) {
      updateTotalGift();
      const interval = setInterval(updateTotalGift, 2000);
      return () => clearInterval(interval);
    }
  }, [nfts]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Подключите кошелёк TON</h1>
        <p className="text-gray-600 text-center">
          Для доступа к функционалу фарминга необходимо подключить кошелёк TON Keeper
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Заголовок и баланс */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Фарминг GIFT</h1>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Ваш баланс GIFT:</p>
            <p className="text-3xl font-bold">{totalGift.toFixed(3)}</p>
          </div>
          {nfts.length > 0 && (
            <p className="text-gray-600">
              Доступно NFT для фарминга: {nfts.length}
            </p>
          )}
        </div>
      </div>

      {/* Загрузка */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Загрузка NFT...</p>
        </div>
      )}

      {/* Список NFT */}
      {!isLoading && nfts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            У вас нет NFT, подходящих для фарминга
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {nfts.map(nft => (
          <NFTCard 
            key={nft.address} 
            nft={nft} 
            onBalanceUpdate={updateTotalGift}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 