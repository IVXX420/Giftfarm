import { useTonConnect } from '../hooks/useTonConnect';

interface HeaderProps {
  onDisconnect: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ onDisconnect }) => {
  const { wallet } = useTonConnect();

  return (
    <div className="glass-panel mb-4 sm:mb-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        {/* Кошелек слева */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div className="text-sm text-gray-300">
              {wallet ? (
                <span className="flex items-center space-x-2">
                  <span className="font-medium text-white">{wallet.shortAddress}</span>
                  <span className="text-xs text-gray-400">(TON)</span>
                </span>
              ) : (
                <span className="text-gray-400">Кошелек не подключен</span>
              )}
            </div>
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
          <div className="relative">
            <span className="text-3xl animate-float">🎁</span>
            <div className="absolute inset-0 animate-glow-pulse rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold gradient-text animate-neon-pulse">
              Gift Farm
            </span>
            <span className="text-xs text-gray-400">
              Фарминг NFT в TON
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 