import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const Dashboard: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // Если кошелек не подключен, перенаправляем на главную
    if (!tonConnectUI.connected) {
      navigate('/');
    }
  }, [tonConnectUI.connected, navigate]);

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await tonConnectUI.disconnect();
      navigate('/');
    } catch (err) {
      console.error('Ошибка отключения кошелька:', err);
    } finally {
      setIsLoading(false);
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
      {/* Здесь будет список NFT и функционал фарминга */}
    </Container>
  );
};

export default Dashboard; 