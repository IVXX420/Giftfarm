import React from 'react';
import { useTonConnect } from '../hooks/useTonConnect';
import Logo from './Logo';

interface HeaderProps {
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="flex items-center justify-between">
        {/* Кошелек слева */}
        <div className="flex items-center space-x-4">
          <div className="text-left">
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

        {/* Логотип и название справа */}
        <div className="flex items-center">
          <div className="text-3xl mr-2">🎁</div>
          <span className="text-2xl text-blue-400 font-bold">Gift Farm</span>
        </div>
      </div>
    </div>
  );
};

export default Header; 