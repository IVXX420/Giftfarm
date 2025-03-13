import React from 'react';
import { useTonConnect } from '../hooks/useTonConnect';

interface HeaderProps {
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="flex justify-end mb-4">
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Ваш адрес</p>
          <div className="glass-panel px-3 py-1.5">
            <p className="text-xs sm:text-sm font-mono text-gray-300">
              {wallet?.shortAddress}
            </p>
          </div>
        </div>
        <button 
          onClick={onDisconnect}
          className="button-base py-1.5 sm:py-2 px-3 sm:px-4 text-sm sm:text-base"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Header; 