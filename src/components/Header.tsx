import React from 'react';
import { useTonConnect } from '../hooks/useTonConnect';

interface HeaderProps {
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { tonConnectUI } = useTonConnect();

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-900 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          Gift Farm 🎁
        </div>
        <nav className="flex items-center space-x-4">
          {tonConnectUI.account && (
            <button
              onClick={onDisconnect}
              className="text-white hover:text-blue-200 transition-colors"
            >
              Отключить кошелёк
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 