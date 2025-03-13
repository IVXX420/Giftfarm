import PaymentService from './payment';

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
      console.log('Начало оформления подписки');
      
      // Создаем транзакцию для оплаты
      const transaction = await PaymentService.createSubscriptionPayment();
      console.log('Транзакция создана:', transaction);

      // Отправляем транзакцию через TON Connect
      const result = await tonConnect.sendTransaction({
        validUntil: transaction.validUntil,
        messages: transaction.messages
      });
      console.log('Результат транзакции:', result);

      if (result && result.boc) {
        // Если транзакция успешна, активируем подписку
        PaymentService.activateSubscription();
        console.log('Подписка активирована');
        return true;
      }

      console.log('Транзакция не удалась');
      return false;
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      throw error;
    }
  }
}

export default SubscriptionService; 