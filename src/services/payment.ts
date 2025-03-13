import { Address, toNano } from '@ton/core';

class PaymentService {
  private static SUBSCRIPTION_PRICE = 10; // 10 TON за подписку
  private static SUBSCRIPTION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
  private static OWNER_ADDRESS = 'EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI'; // Адрес владельца для получения платежей
  private static apiEndpoint = 'https://api.ton.dev'; // Замените на реальный API-конечный путь
  private static apiKey = 'your-api-key'; // Замените на реальный API-ключ

  // Создаем транзакцию для оплаты подписки
  static async createSubscriptionPayment() {
    try {
      // Формируем данные для транзакции
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 минут на оплату
        messages: [
          {
            address: Address.parse(this.OWNER_ADDRESS).toString(),
            amount: toNano(this.SUBSCRIPTION_PRICE.toString()).toString(),
            payload: 'Subscription payment', // Можно добавить дополнительные данные
          },
        ],
      };

      return transaction;
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      throw error;
    }
  }

  // Проверяем статус подписки
  static isSubscriptionActive(): boolean {
    const subscriptionData = localStorage.getItem('subscription');
    if (!subscriptionData) return false;

    const { expiresAt } = JSON.parse(subscriptionData);
    return Date.now() < expiresAt;
  }

  // Активируем подписку после успешной оплаты
  static activateSubscription() {
    const subscriptionData = {
      active: true,
      startedAt: Date.now(),
      expiresAt: Date.now() + this.SUBSCRIPTION_DURATION,
    };
    localStorage.setItem('subscription', JSON.stringify(subscriptionData));
  }

  // Получаем информацию о подписке
  static getSubscriptionInfo() {
    const subscriptionData = localStorage.getItem('subscription');
    if (!subscriptionData) return null;

    return JSON.parse(subscriptionData);
  }

  // Проверяем статус транзакции
  static async checkTransactionStatus(transactionHash: string): Promise<boolean> {
    try {
      // Здесь будет реальная проверка транзакции через TON API
      console.log('Проверка транзакции:', transactionHash);
      const response = await fetch(`${this.apiEndpoint}/transactions/${transactionHash}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('Ошибка при проверке транзакции:', await response.text());
        return false;
      }

      const data = await response.json();
      return data.status === 'completed';
    } catch (error) {
      console.error('Ошибка при проверке транзакции:', error);
      return false;
    }
  }
}

export default PaymentService; 