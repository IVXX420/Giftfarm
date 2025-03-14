import { useTonConnect } from '../hooks/useTonConnect';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onDisconnect: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/5 border-b border-white/10">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 max-w-7xl mx-auto">
          {/* Кошелек слева */}
          <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-xs sm:text-sm text-gray-300">
              {wallet ? (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-medium">{wallet.shortAddress}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-500"></div>
                  <span>Кошелек не подключен</span>
                </div>
              )}
            </div>
            {wallet && (
              <button
                onClick={onDisconnect}
                className="text-xs sm:text-sm text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center space-x-1 sm:space-x-1.5"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Выйти</span>
              </button>
            )}
          </div>

          {/* Логотип и название справа */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-2xl sm:text-3xl">🎁</span>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Gift Farm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 