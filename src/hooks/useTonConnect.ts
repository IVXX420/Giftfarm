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
    updateWallet();
  }, [updateWallet]);

  return {
    connected: tonConnectUI.connected,
    wallet,
    tonConnectUI,
  };
} 