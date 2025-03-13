import { TonConnect } from '@tonconnect/sdk';

// Конфигурация TON Connect
export const tonConnectConfig = {
  manifestUrl: 'https://giftfarm.vercel.app/tonconnect-manifest.json',
  buttonRootId: 'ton-connect',
  // Настройки для работы с TON API
  apiKey: import.meta.env.VITE_TON_API_KEY || '', // API ключ будет добавлен через переменные окружения
  // Настройки для работы с TON Connect
  connectItems: [
    {
      name: 'tonkeeper',
      bridgeUrl: 'https://bridge.tonapi.io/bridge',
      universalUrl: 'https://app.tonkeeper.com/connect',
      aboutUrl: 'https://tonkeeper.com',
    },
  ],
};

// Создаем экземпляр TON Connect
export const tonConnect = new TonConnect(tonConnectConfig);

// Функция для инициализации TON Connect
export const initTonConnect = async () => {
  try {
    await tonConnect.init();
    console.log('TON Connect успешно инициализирован');
  } catch (error) {
    console.error('Ошибка инициализации TON Connect:', error);
    throw error;
  }
}; 