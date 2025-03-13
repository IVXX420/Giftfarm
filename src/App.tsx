import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import { useTonConnectUI } from '@tonconnect/ui-react';
import './styles/global.css';

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

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
`;

const App: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initConnection = async () => {
      try {
        await tonConnectUI.connectionRestored;
      } catch (err) {
        console.error('Ошибка восстановления подключения:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initConnection();
  }, [tonConnectUI]);

  if (isLoading) {
    return <LoadingScreen>Загрузка...</LoadingScreen>;
  }

  return (
    <Router>
      <AppContainer className="app fade-in">
        <Header>
          <Title>TON NFT Фармер</Title>
          <div className="balance pulse">
            {balance.toFixed(3)} GIFT
          </div>
        </Header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              tonConnectUI.connected ? <Navigate to="/dashboard" /> : <WalletConnect />
            } />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="footer">
          <button className="button">Подписка</button>
        </footer>
      </AppContainer>
    </Router>
  );
};

export default App; 