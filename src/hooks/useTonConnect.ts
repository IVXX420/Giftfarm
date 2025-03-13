import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState<{ address: string; chain: string } | null>(null);

  const updateWallet = useCallback(() => {
    if (tonConnectUI.account) {
      setWallet({
        address: tonConnectUI.account.address,
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