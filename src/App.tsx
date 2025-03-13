import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import { useTonConnectUI } from '@tonconnect/ui-react';

const AppContainer = styled.div`
  max-width: 100%;
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
`;

const Header = styled.header`
  padding: 20px;
  text-align: center;
  background: var(--tg-theme-secondary-bg-color, #f0f0f0);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: var(--tg-theme-text-color);
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: var(--tg-theme-hint-color);
  margin-bottom: 20px;
  line-height: 1.5;
`;

const App: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();

  return (
    <Router>
      <AppContainer>
        <Header>
          <Title>Gift Farm</Title>
          <Description>
            Подключите кошелек TON Keeper и начните получать GIFT токены за ваши NFT.
            Каждый NFT приносит 1 GIFT токен в час в течение 12 часов.
          </Description>
        </Header>
        <Routes>
          <Route path="/" element={
            tonConnectUI.connected ? <Navigate to="/dashboard" /> : <WalletConnect />
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App; 