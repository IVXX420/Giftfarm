import { useTonConnect } from '../hooks/useTonConnect';

interface HeaderProps {
  onDisconnect: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="backdrop-blur-lg bg-white/5 border-b border-white/10 mb-6">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Кошелек слева */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300">
              {wallet ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>{wallet.shortAddress}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span>Кошелек не подключен</span>
                </div>
              )}
            </div>
            {wallet && (
              <button
                onClick={onDisconnect}
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Выйти</span>
              </button>
            )}
          </div>

          {/* Логотип и название справа */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🎁</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Gift Farm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 