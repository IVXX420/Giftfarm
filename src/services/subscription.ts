import PaymentService from './payment';
import { useTonConnectUI } from '@tonconnect/ui-react';

class SubscriptionService {
  private static FARMING_MULTIPLIER = 1.5;

  // Получить множитель фарминга
  static getFarmingMultiplier(): number {
    return this.isSubscribed() ? this.FARMING_MULTIPLIER : 1;
  }

  // Проверить статус подписки
  static isSubscribed(): boolean {
    return PaymentService.isSubscriptionActive();
  }

  // Получить информацию о подписке
  static getSubscriptionInfo() {
    return PaymentService.getSubscriptionInfo();
  }

  // Оформить подписку
  static async subscribe(tonConnect: any) {
    try {
      // Создаем транзакцию для оплаты
      const transaction = await PaymentService.createSubscriptionPayment();

      // Отправляем транзакцию через TON Connect
      const result = await tonConnect.sendTransaction(transaction);

      if (result.success) {
        // Если транзакция успешна, активируем подписку
        PaymentService.activateSubscription();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      throw error;
    }
  }
}

export default SubscriptionService; 