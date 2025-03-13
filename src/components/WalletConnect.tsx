import React, { useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ConnectButton = styled.button`
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

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: var(--border-radius);
`;

const WalletConnect: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await tonConnectUI.connectionRestored;
        
        if (tonConnectUI.connected) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Ошибка проверки подключения:', err);
      }
    };

    checkConnection();
  }, [tonConnectUI, navigate]);

  const handleConnect = async () => {
    try {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      if (tonConnectUI.connected) {
        navigate('/dashboard');
        return;
      }

      await tonConnectUI.connectWallet();
      navigate('/dashboard');
    } catch (err) {
      console.error('Ошибка подключения кошелька:', err);
      setError(err instanceof Error ? err.message : 'Не удалось подключить кошелек. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tonConnectUI.connected) {
    return null;
  }

  return (
    <div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ConnectButton onClick={handleConnect} disabled={isLoading}>
        {isLoading ? 'Подключение...' : 'Подключить TON Keeper'}
      </ConnectButton>
    </div>
  );
};

export default WalletConnect; 