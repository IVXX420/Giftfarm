import { TonConnect } from '@tonconnect/sdk';

// Конфигурация TON Connect
const manifestUrl = import.meta.env.VITE_MANIFEST_URL;

// Создаем экземпляр TON Connect
export const tonConnect = new TonConnect({
  manifestUrl,
});

// Функция для инициализации TON Connect
export const initTonConnect = async () => {
  try {
    await tonConnect.restoreConnection();
    console.log('TON Connect успешно инициализирован');
  } catch (error) {
    console.error('Ошибка инициализации TON Connect:', error);
    throw error;
  }
}; 