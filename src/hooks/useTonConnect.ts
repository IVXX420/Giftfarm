import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { Address } from '@ton/core';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState<{ address: string; chain: string; shortAddress: string } | null>(null);

  const formatAddress = (address: string): string => {
    try {
      return Address.parse(address).toString({ urlSafe: true, bounceable: true });
    } catch (error) {
      console.error('Ошибка форматирования адреса:', error);
      return address;
    }
  };

  const shortenAddress = (address: string): string => {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const updateWallet = useCallback(() => {
    if (tonConnectUI.account) {
      const formattedAddress = formatAddress(tonConnectUI.account.address);
      setWallet({
        address: formattedAddress,
        shortAddress: shortenAddress(formattedAddress),
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