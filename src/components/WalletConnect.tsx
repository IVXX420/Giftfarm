import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { tonConnect } from '../config/ton';

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

const WalletInfo = styled.div`
  text-align: center;
  margin: 10px 0;
  padding: 10px;
  background-color: var(--tg-theme-secondary-bg-color, #f0f0f0);
  border-radius: var(--border-radius);
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

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Проверяем, не подключен ли уже кошелек
      if (tonConnectUI.connected) {
        console.log('Кошелек уже подключен');
        setIsLoading(false);
        return;
      }

      // Подключаем кошелек через TON Connect
      await tonConnectUI.connectWallet();
      
      // Получаем информацию о кошельке
      const account = tonConnectUI.account;
      if (!account) {
        throw new Error('Не удалось получить информацию о кошельке');
      }

      console.log('Кошелек успешно подключен:', account);
    } catch (err) {
      console.error('Ошибка подключения кошелька:', err);
      setError(err instanceof Error ? err.message : 'Не удалось подключить кошелек. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await tonConnectUI.disconnect();
      console.log('Кошелек успешно отключен');
    } catch (err) {
      console.error('Ошибка отключения кошелька:', err);
      setError('Не удалось отключить кошелек. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!tonConnectUI.connected ? (
        <ConnectButton onClick={handleConnect} disabled={isLoading}>
          {isLoading ? 'Подключение...' : 'Подключить TON Keeper'}
        </ConnectButton>
      ) : (
        <>
          <WalletInfo>
            Кошелек подключен: {tonConnectUI.account?.address.slice(0, 6)}...{tonConnectUI.account?.address.slice(-4)}
          </WalletInfo>
          <ConnectButton onClick={handleDisconnect} disabled={isLoading}>
            {isLoading ? 'Отключение...' : 'Отключить кошелек'}
          </ConnectButton>
        </>
      )}
    </div>
  );
};

export default WalletConnect; 