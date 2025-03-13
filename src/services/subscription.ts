class SubscriptionService {
  private subscriptionKey = 'gift_farm_subscription';
  private multiplier = 1.5;

  constructor() {
    this.loadSubscriptionState();
  }

  private loadSubscriptionState() {
    const savedState = localStorage.getItem(this.subscriptionKey);
    if (savedState) {
      const { expiresAt } = JSON.parse(savedState);
      if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(this.subscriptionKey);
      }
    }
  }

  isSubscribed(): boolean {
    const savedState = localStorage.getItem(this.subscriptionKey);
    if (!savedState) return false;

    const { expiresAt } = JSON.parse(savedState);
    return new Date(expiresAt).getTime() > Date.now();
  }

  async subscribe(): Promise<void> {
    // В будущем здесь будет реальная оплата через TON
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Подписка на 30 дней

    localStorage.setItem(this.subscriptionKey, JSON.stringify({
      expiresAt: expiresAt.toISOString()
    }));
  }

  getFarmingMultiplier(): number {
    return this.isSubscribed() ? this.multiplier : 1;
  }

  getSubscriptionEndDate(): Date | null {
    const savedState = localStorage.getItem(this.subscriptionKey);
    if (!savedState) return null;

    const { expiresAt } = JSON.parse(savedState);
    return new Date(expiresAt);
  }
}

export default new SubscriptionService(); 