import PaymentService from './payment';

interface TonConnectResult {
  boc: string;
  [key: string]: any;
}

interface TonConnect {
  sendTransaction: (transaction: {
    validUntil: number;
    messages: Array<{
      address: string;
      amount: string;
    }>;
  }) => Promise<TonConnectResult>;
}

class SubscriptionService {
  private static readonly PREMIUM_KEY = 'is_premium';
  private static readonly FARMING_MULTIPLIER = 1.5;

  static isPremium(): boolean {
    return localStorage.getItem(this.PREMIUM_KEY) === 'true';
  }

  static activatePremium(): void {
    localStorage.setItem(this.PREMIUM_KEY, 'true');
  }

  static deactivatePremium(): void {
    localStorage.removeItem(this.PREMIUM_KEY);
  }

  // Получить множитель фарминга
  static getFarmingMultiplier(): number {
    return this.isPremium() ? this.FARMING_MULTIPLIER : 1;
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
  static async subscribe(tonConnect: TonConnect): Promise<boolean> {
    try {
      console.log('Начало оформления подписки');
      
      const transaction = await PaymentService.createSubscriptionPayment();
      if (!transaction) {
        throw new Error('Не удалось создать транзакцию');
      }
      
      console.log('Транзакция создана:', transaction);

      const result = await tonConnect.sendTransaction({
        validUntil: transaction.validUntil,
        messages: transaction.messages
      });
      
      console.log('Результат транзакции:', result);

      if (result?.boc) {
        PaymentService.activateSubscription();
        this.activatePremium();
        console.log('Подписка активирована');
        return true;
      }

      throw new Error('Транзакция не удалась');
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      throw error;
    }
  }

  static async cancelSubscription(): Promise<boolean> {
    try {
      PaymentService.deactivateSubscription();
      this.deactivatePremium();
      return true;
    } catch (error) {
      console.error('Ошибка при отмене подписки:', error);
      throw error;
    }
  }
}

export default SubscriptionService; 