import React from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';

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

  const handleConnect = async () => {
    try {
      setError(null);
      await tonConnectUI.connectWallet();
    } catch (err) {
      console.error('Ошибка подключения кошелька:', err);
      setError('Не удалось подключить кошелек. Пожалуйста, попробуйте еще раз.');
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await tonConnectUI.disconnect();
    } catch (err) {
      console.error('Ошибка отключения кошелька:', err);
      setError('Не удалось отключить кошелек. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!tonConnectUI.connected ? (
        <ConnectButton onClick={handleConnect}>
          Подключить TON Keeper
        </ConnectButton>
      ) : (
        <>
          <WalletInfo>
            Кошелек подключен: {tonConnectUI.account?.address.slice(0, 6)}...{tonConnectUI.account?.address.slice(-4)}
          </WalletInfo>
          <ConnectButton onClick={handleDisconnect}>
            Отключить кошелек
          </ConnectButton>
        </>
      )}
    </div>
  );
};

export default WalletConnect; 