import React from 'react';
import styled from 'styled-components';
import { NFT } from '../types/nft';
import nftService from '../services/nft';

const Card = styled.div`
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  color: var(--tg-theme-text-color);
  margin: 0 0 8px;
  font-size: 18px;
`;

const Description = styled.p`
  color: var(--tg-theme-hint-color);
  margin: 0 0 16px;
  font-size: 14px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${props => 
    props.variant === 'secondary' 
      ? 'var(--tg-theme-secondary-bg-color, #f0f0f0)' 
      : 'var(--tg-theme-button-color, #2481cc)'
  };
  color: ${props => 
    props.variant === 'secondary'
      ? 'var(--tg-theme-text-color)'
      : 'var(--tg-theme-button-text-color, #ffffff)'
  };
  border: none;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Timer = styled.div`
  text-align: center;
  margin: 8px 0;
  font-size: 16px;
  color: var(--tg-theme-text-color);
`;

const GiftAmount = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
`;

interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (nft.stakingStartTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const end = nft.stakingStartTime! + (12 * 60 * 60 * 1000); // 12 часов
        const left = end - now;
        
        if (left <= 0) {
          setTimeLeft(null);
          clearInterval(interval);
        } else {
          setTimeLeft(left);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [nft.stakingStartTime]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartFarming = async () => {
    try {
      setIsLoading(true);
      await nftService.startFarming(nft.address);
    } catch (error) {
      console.error('Ошибка при старте фарминга:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectReward = async () => {
    try {
      setIsLoading(true);
      await nftService.collectReward(nft.address);
    } catch (error) {
      console.error('Ошибка при сборе наград:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      {nft.accumulatedGift && (
        <GiftAmount>{nft.accumulatedGift} GIFT</GiftAmount>
      )}
      <Image src={nft.metadata.image} alt={nft.metadata.name} />
      <Title>{nft.metadata.name}</Title>
      {nft.metadata.description && (
        <Description>{nft.metadata.description}</Description>
      )}
      
      {timeLeft !== null ? (
        <>
          <Timer>Осталось: {formatTime(timeLeft)}</Timer>
          <Button disabled>Фарминг в процессе...</Button>
        </>
      ) : nft.isStaking ? (
        <Button 
          onClick={handleCollectReward} 
          disabled={isLoading}
        >
          {isLoading ? 'Сбор наград...' : 'Собрать награды'}
        </Button>
      ) : (
        <Button 
          onClick={handleStartFarming} 
          disabled={isLoading}
        >
          {isLoading ? 'Запуск фарминга...' : 'Начать фарминг'}
        </Button>
      )}
    </Card>
  );
};

export default NFTCard; 