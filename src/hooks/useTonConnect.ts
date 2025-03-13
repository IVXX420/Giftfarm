import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { Address } from '@ton/core';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState<{ address: string; chain: string } | null>(null);

  const formatAddress = (address: string): string => {
    try {
      return Address.parse(address).toString({ urlSafe: true, bounceable: true });
    } catch (error) {
      console.error('Ошибка форматирования адреса:', error);
      return address;
    }
  };

  const updateWallet = useCallback(() => {
    if (tonConnectUI.account) {
      setWallet({
        address: formatAddress(tonConnectUI.account.address),
        chain: tonConnectUI.account.chain,
      });
    } else {
      setWallet(null);
    }
  }, [tonConnectUI.account]);

  useEffect(() => {
    // Проверяем состояние подключения при инициализации
    tonConnectUI.connectionRestored.then(() => {
      updateWallet();
    });

    // Подписываемся на изменения состояния подключения
    const unsubscribe = tonConnectUI.onStatusChange(updateWallet);

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, updateWallet]);

  return {
    connected: tonConnectUI.connected,
    wallet,
    tonConnectUI,
  };
} 