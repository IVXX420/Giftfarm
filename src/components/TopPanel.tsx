import React from 'react';
import Logo from './Logo';
import { useTonConnect } from '../hooks/useTonConnect';

interface TopPanelProps {
  onDisconnect: () => void;
}

const TopPanel: React.FC<TopPanelProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8 hover-scale">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center sm:text-right">
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
    </div>
  );
};

export default TopPanel; 