import React from 'react';
import Logo from './Logo';
import { useTonConnectUI } from '@tonconnect/ui-react';

const Header: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = tonConnectUI.account;

  return (
    <header className="glass-panel p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {wallet && (
          <div className="text-sm text-gray-400">
            Кошелёк: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 