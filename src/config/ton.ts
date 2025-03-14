import { TonConnect } from '@tonconnect/sdk';

// Конфигурация TON Connect
export const manifestUrl = import.meta.env.VITE_MANIFEST_URL;

// Создаем экземпляр TON Connect
export const tonConnect = new TonConnect({
  manifestUrl,
  walletsListSource: 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets.json',
});

// Функция для проверки сети
export const checkNetwork = (chain: string | undefined) => {
  if (!chain) return false;
  // В продакшене используем mainnet
  return chain === '-239';
};

// Функция для инициализации TON Connect
export const initTonConnect = async () => {
  try {
    await tonConnect.restoreConnection();
    console.log('TON Connect успешно инициализирован');
    // Проверяем подключенный кошелек
    const wallet = tonConnect.wallet;
    if (wallet) {
      console.log('Connected wallet:', wallet.account);
      console.log('Network:', wallet.account.chain);
      // Проверяем сеть
      if (!checkNetwork(wallet.account.chain)) {
        console.warn('Внимание: подключен не к основной сети TON');
      }
    }
  } catch (error) {
    console.error('Ошибка инициализации TON Connect:', error);
    throw error;
  }
}; 