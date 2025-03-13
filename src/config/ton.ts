import { TonConnect } from '@tonconnect/sdk';

// Конфигурация TON Connect
const manifestUrl = import.meta.env.VITE_MANIFEST_URL;

// Создаем экземпляр TON Connect
export const tonConnect = new TonConnect({
  manifestUrl,
  walletsListSource: 'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets.json',
});

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
    }
  } catch (error) {
    console.error('Ошибка инициализации TON Connect:', error);
    throw error;
  }
}; 