export interface LeaderboardEntry {
  username: string;
  coins: number;
  rank: number;
  address: string;
  isOnline: boolean;
}

export interface LeaderboardData {
  leaders: LeaderboardEntry[];
  totalCoins: number;
}

class LeaderboardService {
  private static instance: LeaderboardService;
  private cache: LeaderboardData | null = null;
  private lastUpdate: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 минут
  private readonly API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  private constructor() {}

  public static getInstance(): LeaderboardService {
    if (!LeaderboardService.instance) {
      LeaderboardService.instance = new LeaderboardService();
    }
    return LeaderboardService.instance;
  }

  public async getLeaderboard(): Promise<LeaderboardData> {
    // Проверяем, нужно ли обновить кэш
    if (this.cache && Date.now() - this.lastUpdate < this.CACHE_DURATION) {
      return this.cache;
    }

    try {
      const response = await fetch(`${this.API_URL}/leaderboard`);
      if (!response.ok) {
        throw new Error('Ошибка при получении таблицы лидеров');
      }
      const data = await response.json();
      
      // Сортируем по количеству монет
      data.leaders.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.coins - a.coins);
      
      // Добавляем ранги
      data.leaders = data.leaders.map((leader: LeaderboardEntry, index: number) => ({
        ...leader,
        rank: index + 1
      }));

      this.cache = data;
      this.lastUpdate = Date.now();
      return data;
    } catch (error) {
      console.error('Ошибка при получении таблицы лидеров:', error);
      // Возвращаем кэш, если он есть, даже если он устарел
      if (this.cache) {
        return this.cache;
      }
      throw error;
    }
  }

  public async updateUserCoins(address: string, coins: number): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/leaderboard/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, coins }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении монет пользователя');
      }

      // Инвалидируем кэш
      this.cache = null;
    } catch (error) {
      console.error('Ошибка при обновлении монет пользователя:', error);
      throw error;
    }
  }

  public async updateUserStatus(address: string, isOnline: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.API_URL}/leaderboard/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, isOnline }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении статуса пользователя');
      }

      // Инвалидируем кэш
      this.cache = null;
    } catch (error) {
      console.error('Ошибка при обновлении статуса пользователя:', error);
      throw error;
    }
  }
}

export default LeaderboardService; 