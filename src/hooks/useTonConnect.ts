import { useTonConnectUI } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { ConnectedWallet } from '@tonconnect/ui';

export function useTonConnect() {
  const [tonConnectUI] = useTonConnectUI();
  const [connected, setConnected] = useState(false);

  const onStatusChange = useCallback((wallet: ConnectedWallet | null) => {
    setConnected(!!wallet);
  }, []);

  useEffect(() => {
    tonConnectUI.connectionRestored.then((wallet) => {
      setConnected(!!wallet);
    });

    tonConnectUI.onStatusChange(onStatusChange);
  }, [onStatusChange, tonConnectUI]);

  return {
    connected,
    wallet: tonConnectUI.account,
    network: tonConnectUI.network,
  };
} 