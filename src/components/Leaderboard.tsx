import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import LeaderboardService, { LeaderboardEntry } from '../services/leaderboard';

const Leaderboard: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [totalCoins, setTotalCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const navigate = useNavigate();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 секунд

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LeaderboardService.getInstance().getLeaderboard();
      setLeaders(data.leaders);
      setTotalCoins(data.totalCoins);
      setRetryCount(0); // Сбрасываем счетчик попыток при успехе
    } catch (err) {
      console.error('Ошибка при загрузке таблицы лидеров:', err);
      setError('Не удалось загрузить таблицу лидеров. Попробуйте позже.');
      
      // Автоматическая повторная попытка
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, RETRY_DELAY);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10 * 60 * 1000); // Обновление каждые 10 минут
    return () => clearInterval(interval);
  }, [retryCount]); // Добавляем retryCount в зависимости

  const handleBack = () => {
    if (tonConnectUI.account) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Загрузка таблицы лидеров...</div>
          {retryCount > 0 && (
            <div className="text-white/70 mt-2">
              Попытка {retryCount} из {MAX_RETRIES}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          {retryCount < MAX_RETRIES ? (
            <div className="text-white/70">
              Повторная попытка через {Math.ceil((RETRY_DELAY - (retryCount * RETRY_DELAY)) / 1000)} секунд...
            </div>
          ) : (
            <button
              onClick={() => {
                setRetryCount(0);
                fetchLeaderboard();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Таблица лидеров</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Назад
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8 transform transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-xl text-white mb-4">Общая статистика</h2>
          <div className="text-2xl font-bold text-blue-400">
            Всего собрано монет: {totalCoins.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Ранг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white/70 uppercase tracking-wider">
                    Монеты
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaders.map((leader, index) => (
                  <tr 
                    key={leader.username} 
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      <span className={`font-bold ${
                        index === 0 ? 'text-yellow-400' :
                        index === 1 ? 'text-gray-300' :
                        index === 2 ? 'text-amber-600' :
                        'text-white'
                      }`}>
                        #{leader.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {leader.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-400">
                      {leader.coins.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        leader.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {leader.isOnline ? 'Онлайн' : 'Оффлайн'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 