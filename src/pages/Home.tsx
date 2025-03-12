import React from 'react';
import styled from 'styled-components';
import WalletConnect from '../components/WalletConnect';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  color: var(--tg-theme-text-color);
  text-align: center;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: var(--tg-theme-hint-color, #999999);
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Title>TON NFT Фарм</Title>
      <Description>
        Добро пожаловать в TON NFT Фарм! Здесь вы можете подключить свой кошелек TON Keeper,
        выбрать NFT из поддерживаемых коллекций и начать получать пассивный доход в монетах GIFT.
        Чем больше NFT вы используете, тем больше монет сможете заработать!
      </Description>
      <WalletConnect />
    </Container>
  );
};

export default Home; 