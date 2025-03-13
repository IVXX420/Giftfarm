import React from 'react';
import styled from 'styled-components';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { nftService } from '../services/nft';
import { NFT } from '../types/nft';
import NFTCard from './NFTCard';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const LoadingText = styled.div`
  text-align: center;
  color: var(--tg-theme-hint-color);
  margin: 20px 0;
`;

const ErrorText = styled.div`
  text-align: center;
  color: #ff4444;
  margin: 20px 0;
  padding: 10px;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
`;

const NoNFTsText = styled.div`
  text-align: center;
  color: var(--tg-theme-hint-color);
  margin: 40px 0;
  font-size: 16px;
`;

const Stats = styled.div`
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
`;

const StatItem = styled.div`
  h4 {
    margin: 0 0 8px;
    color: var(--tg-theme-hint-color);
    font-size: 14px;
  }
  
  p {
    margin: 0;
    color: var(--tg-theme-text-color);
    font-size: 18px;
    font-weight: bold;
  }
`;

const NFTList: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [nfts, setNfts] = React.useState<NFT[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadNFTs = React.useCallback(async () => {
    if (!tonConnectUI.account) return;

    try {
      setIsLoading(true);
      setError(null);
      const userNFTs = await nftService.getUserNFTs(tonConnectUI.account.address);
      setNfts(userNFTs);
    } catch (err) {
      console.error('Ошибка при загрузке NFT:', err);
      setError('Не удалось загрузить NFT. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  }, [tonConnectUI.account]);

  React.useEffect(() => {
    if (tonConnectUI.connected) {
      loadNFTs();
    } else {
      setNfts([]);
    }
  }, [tonConnectUI.connected, loadNFTs]);

  const totalNFTs = nfts.length;
  const stakingNFTs = nfts.filter(nft => nft.isStaking).length;
  const totalGift = nfts.reduce((sum, nft) => sum + (nft.accumulatedGift || 0), 0);

  if (!tonConnectUI.connected) {
    return (
      <Container>
        <NoNFTsText>
          Подключите кошелек, чтобы увидеть свои NFT
        </NoNFTsText>
      </Container>
    );
  }

  return (
    <Container>
      <Stats>
        <StatItem>
          <h4>Всего NFT</h4>
          <p>{totalNFTs}</p>
        </StatItem>
        <StatItem>
          <h4>В фарминге</h4>
          <p>{stakingNFTs}</p>
        </StatItem>
        <StatItem>
          <h4>Накоплено GIFT</h4>
          <p>{totalGift}</p>
        </StatItem>
      </Stats>

      {isLoading ? (
        <LoadingText>Загрузка NFT...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : nfts.length === 0 ? (
        <NoNFTsText>
          У вас нет NFT из поддерживаемых коллекций
        </NoNFTsText>
      ) : (
        <Grid>
          {nfts.map(nft => (
            <NFTCard key={nft.address} nft={nft} />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default NFTList; 