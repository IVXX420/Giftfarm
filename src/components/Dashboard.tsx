import React, { useEffect, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { nftService } from '../services/nft';
import { NFT } from '../types/nft';

const Container = styled.div`
  padding: 20px;
`;

const WalletInfo = styled.div`
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: var(--border-radius);
`;

const DisconnectButton = styled.button`
  background-color: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: var(--border-radius);
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  max-width: 320px;
  margin: 10px auto;
  display: block;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const NFTCard = styled.div`
  background: var(--tg-theme-bg-color);
  border: 1px solid var(--tg-theme-hint-color);
  border-radius: var(--border-radius);
  padding: 15px;
  text-align: center;
`;

const NFTImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  margin-bottom: 10px;
`;

const NFTName = styled.h3`
  margin: 10px 0;
  color: var(--tg-theme-text-color);
`;

const FarmButton = styled.button`
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border: none;
  border-radius: var(--border-radius);
  padding: 8px 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  margin: 20px 0;
  color: var(--tg-theme-hint-color);
`;

const ErrorText = styled.div`
  color: #ff4444;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: var(--border-radius);
`;

const Dashboard: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    if (!tonConnectUI.connected) {
      navigate('/');
      return;
    }

    const loadNFTs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!tonConnectUI.account?.address) {
          throw new Error('Адрес кошелька не найден');
        }

        console.log('Загрузка NFT для адреса:', tonConnectUI.account.address);
        const userNFTs = await nftService.getUserNFTs(tonConnectUI.account.address);
        console.log('Загруженные NFT:', userNFTs);
        setNfts(userNFTs);
      } catch (err) {
        console.error('Ошибка загрузки NFT:', err);
        setError('Не удалось загрузить NFT. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, [tonConnectUI.connected, tonConnectUI.account, navigate]);

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await tonConnectUI.disconnect();
      navigate('/');
    } catch (err) {
      console.error('Ошибка отключения кошелька:', err);
      setError('Не удалось отключить кошелек');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFarming = async (nftAddress: string) => {
    try {
      await nftService.startFarming(nftAddress);
      // Обновляем список NFT после начала фарминга
      const updatedNFTs = await nftService.getUserNFTs(tonConnectUI.account!.address);
      setNfts(updatedNFTs);
    } catch (err) {
      console.error('Ошибка запуска фарминга:', err);
      setError('Не удалось запустить фарминг');
    }
  };

  const handleCollectReward = async (nftAddress: string) => {
    try {
      const reward = await nftService.collectReward(nftAddress);
      console.log(`Собрано ${reward} GIFT токенов`);
      // Обновляем список NFT после сбора наград
      const updatedNFTs = await nftService.getUserNFTs(tonConnectUI.account!.address);
      setNfts(updatedNFTs);
    } catch (err) {
      console.error('Ошибка сбора наград:', err);
      setError('Не удалось собрать награды');
    }
  };

  if (!tonConnectUI.connected) {
    return null;
  }

  return (
    <Container>
      <WalletInfo>
        Кошелек подключен: {tonConnectUI.account?.address.slice(0, 6)}...{tonConnectUI.account?.address.slice(-4)}
      </WalletInfo>
      
      <DisconnectButton onClick={handleDisconnect} disabled={isLoading}>
        {isLoading ? 'Отключение...' : 'Отключить кошелек'}
      </DisconnectButton>

      {error && <ErrorText>{error}</ErrorText>}
      
      {isLoading ? (
        <LoadingText>Загрузка NFT...</LoadingText>
      ) : nfts.length === 0 ? (
        <LoadingText>У вас нет NFT из поддерживаемых коллекций</LoadingText>
      ) : (
        <NFTGrid>
          {nfts.map((nft) => (
            <NFTCard key={nft.address}>
              <NFTImage src={nft.metadata.image} alt={nft.metadata.name} />
              <NFTName>{nft.metadata.name}</NFTName>
              {nft.isStaking ? (
                <>
                  <div>Накоплено GIFT: {nft.accumulatedGift}</div>
                  {nft.accumulatedGift >= 12 ? (
                    <FarmButton onClick={() => handleCollectReward(nft.address)}>
                      Собрать {nft.accumulatedGift} GIFT
                    </FarmButton>
                  ) : (
                    <div>До сбора: {12 - nft.accumulatedGift} часов</div>
                  )}
                </>
              ) : (
                <FarmButton onClick={() => handleStartFarming(nft.address)}>
                  Начать фарминг
                </FarmButton>
              )}
            </NFTCard>
          ))}
        </NFTGrid>
      )}
    </Container>
  );
};

export default Dashboard; 