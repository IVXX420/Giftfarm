import { SUPPORTED_COLLECTIONS, NFT } from '../types/nft';
import { Address } from '@ton/core';
import SubscriptionService from './subscription';

class NFTService {
  private farmingState: { [key: string]: { isStaking: boolean; startTime: number } } = {};
  private giftBalance: number = 0;
  private apiEndpoint: string;
  private apiKey: string;
  private giftBalanceKey = 'gift_balance';

  private colorMap: { [key: string]: string } = {
    'chestnut': '#954535',
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#00FF00',
    'yellow': '#FFFF00',
    'purple': '#800080',
    'orange': '#FFA500',
    'pink': '#FFC0CB',
    'white': '#FFFFFF',
    'black': '#000000',
    'gray': '#808080',
    'brown': '#A52A2A',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'bronze': '#CD7F32',
    'navy': '#000080',
    'maroon': '#800000',
    'olive': '#808000',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'teal': '#008080',
    'fuchsia': '#FF00FF',
    'crimson': '#DC143C',
    'indigo': '#4B0082',
    'violet': '#EE82EE',
    'coral': '#FF7F50',
    'turquoise': '#40E0D0',
    'beige': '#F5F5DC',
    'ivory': '#FFFFF0',
    'lavender': '#E6E6FA',
    'mint': '#98FF98',
    'peach': '#FFDAB9',
    'plum': '#DDA0DD',
    'salmon': '#FA8072',
    'tan': '#D2B48C',
    'wheat': '#F5DEB3'
  };

  constructor() {
    this.apiEndpoint = import.meta.env.VITE_TON_ENDPOINT;
    this.apiKey = import.meta.env.VITE_TON_API_KEY;
    this.loadFarmingState();
    this.loadGiftBalance();
  }

  private loadFarmingState() {
    const savedState = localStorage.getItem('farmingState');
    if (savedState) {
      this.farmingState = JSON.parse(savedState);
    }
  }

  private saveFarmingState() {
    localStorage.setItem('farmingState', JSON.stringify(this.farmingState));
  }

  private loadGiftBalance() {
    const savedBalance = localStorage.getItem(this.giftBalanceKey);
    if (savedBalance) {
      this.giftBalance = parseFloat(savedBalance);
    }
  }

  private saveGiftBalance() {
    localStorage.setItem(this.giftBalanceKey, this.giftBalance.toString());
  }

  // Получить баланс GIFT
  getGiftBalance(): number {
    return this.giftBalance;
  }

  // Добавить GIFT к балансу
  private addToBalance(amount: number) {
    this.giftBalance += amount;
    this.saveGiftBalance();
  }

  // Проверить, можно ли собрать награду
  canCollectReward(nftAddress: string): boolean {
    const farmingData = this.farmingState[nftAddress];
    if (!farmingData || !farmingData.isStaking) return false;

    const now = Date.now();
    const elapsedHours = (now - farmingData.startTime) / (1000 * 60 * 60);
    return elapsedHours >= 12; // Можно собрать только после 12 часов
  }

  // Собрать награду с NFT
  async collectReward(nftAddress: string): Promise<number> {
    const farmingData = this.farmingState[nftAddress];
    if (!farmingData || !farmingData.isStaking) return 0;

    const reward = this.calculateAccumulatedGift(nftAddress);
    if (reward > 0) {
      this.addToBalance(reward);
      delete this.farmingState[nftAddress];
      this.saveFarmingState();
    }

    return reward;
  }

  // Собрать награды со всех NFT
  async collectAllRewards(nfts: NFT[]): Promise<number> {
    let totalRewards = 0;
    // Фильтруем только те NFT, с которых можно собрать награду
    const readyToCollect = nfts.filter(nft => {
      const farmingData = this.farmingState[nft.address];
      if (!farmingData?.isStaking) return false;
      
      const now = Date.now();
      const elapsedHours = (now - farmingData.startTime) / (1000 * 60 * 60);
      return elapsedHours >= 12;
    });
    
    if (readyToCollect.length === 0) return 0;

    for (const nft of readyToCollect) {
      const reward = await this.collectReward(nft.address);
      totalRewards += reward;
    }

    return totalRewards;
  }

  // Форматируем адрес в правильный формат
  private formatAddress(address: string): string {
    try {
      // Преобразуем адрес в объект Address из @ton/core
      const formattedAddress = Address.parse(address).toString({ urlSafe: true, bounceable: true });
      console.log('Отформатированный адрес:', formattedAddress);
      return formattedAddress;
    } catch (error) {
      console.error('Ошибка при форматировании адреса:', error);
      return address;
    }
  }

  // Получить все NFT пользователя
  async getUserNFTs(userAddress: string): Promise<NFT[]> {
    try {
      const formattedAddress = this.formatAddress(userAddress);
      console.log('Получаем NFT для адреса:', formattedAddress);
      
      // Получаем список всех NFT на кошельке
      const allNFTs = await this.fetchAccountNFTs(formattedAddress);
      console.log('Все NFT на кошельке:', allNFTs);

      // Фильтруем NFT из поддерживаемых коллекций
      const supportedNFTs = this.filterSupportedNFTs(allNFTs);
      console.log('Поддерживаемые NFT:', supportedNFTs);

      // Получаем метаданные для каждого NFT
      const nftsWithMetadata = await this.enrichNFTsWithMetadata(supportedNFTs);
      console.log('NFT с метаданными:', nftsWithMetadata);

      return nftsWithMetadata;
    } catch (error) {
      console.error('Ошибка при получении NFT:', error);
      throw error;
    }
  }

  // Получить список всех NFT на кошельке
  private async fetchAccountNFTs(address: string): Promise<any[]> {
    try {
      const apiUrl = `${this.apiEndpoint}/accounts/${address}/nfts?limit=1000`;
      console.log('Запрашиваем NFT по адресу:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Сырой ответ от API:', data);
      
      // Проверяем наличие nfts в ответе
      if (!data.nfts) {
        console.error('Неожиданный формат ответа API:', data);
        return [];
      }

      return data.nfts;
    } catch (error) {
      console.error('Ошибка при получении списка NFT:', error);
      throw error;
    }
  }

  // Фильтруем NFT из поддерживаемых коллекций
  private filterSupportedNFTs(nfts: any[]): any[] {
    console.log('Поддерживаемые коллекции:', SUPPORTED_COLLECTIONS);
    console.log('Все полученные NFT:', nfts);
    
    return nfts.filter(nft => {
      const collectionAddress = nft.collection?.address;
      console.log('Проверяем NFT:', {
        address: nft.address,
        collectionAddress: collectionAddress,
        metadata: nft.metadata
      });
      
      if (!collectionAddress) {
        console.log(`NFT ${nft.address} не имеет адреса коллекции`);
        return false;
      }

      // Форматируем адрес коллекции в том же формате
      const formattedCollectionAddress = this.formatAddress(collectionAddress);
      
      const isSupported = SUPPORTED_COLLECTIONS.some(collection => {
        const formattedSupportedAddress = this.formatAddress(collection.address);
        const matches = formattedSupportedAddress === formattedCollectionAddress;
        console.log(`Сравниваем: ${formattedSupportedAddress} с ${formattedCollectionAddress} = ${matches}`);
        return matches;
      });
      
      console.log(`NFT ${nft.address} из коллекции ${formattedCollectionAddress} поддерживается: ${isSupported}`);
      return isSupported;
    });
  }

  // Обогащаем NFT метаданными
  private async enrichNFTsWithMetadata(nfts: any[]): Promise<NFT[]> {
    return Promise.all(nfts.map(async (nft) => {
      const farmingData = this.farmingState[nft.address] || { isStaking: false, startTime: 0 };
      
      return {
        address: nft.address,
        collectionAddress: nft.collection?.address,
        metadata: {
          name: nft.metadata?.name || nft.dns || 'Unnamed NFT',
          description: nft.metadata?.description || '',
          image: nft.metadata?.image || nft.previews?.[0]?.url || '',
          attributes: nft.metadata?.attributes || [],
        },
        isStaking: farmingData.isStaking,
        stakingStartTime: farmingData.startTime,
        accumulatedGift: this.calculateAccumulatedGift(nft.address)
      };
    }));
  }

  // Начать фарминг для NFT
  async startFarming(nftAddress: string): Promise<void> {
    this.farmingState[nftAddress] = {
      isStaking: true,
      startTime: Date.now()
    };
    this.saveFarmingState();
  }

  // Получить накопленные GIFT токены для NFT
  async getAccumulatedGift(nftAddress: string): Promise<number> {
    return this.calculateAccumulatedGift(nftAddress);
  }

  // Рассчитать накопленные GIFT токены
  private calculateAccumulatedGift(nftAddress: string): number {
    const farmingData = this.farmingState[nftAddress];
    if (!farmingData || !farmingData.isStaking) return 0;

    const now = Date.now();
    const elapsedHours = (now - farmingData.startTime) / (1000 * 60 * 60);
    const maxHours = 12;
    const hourlyRate = 1 * SubscriptionService.getFarmingMultiplier();

    return Math.min(elapsedHours * hourlyRate, maxHours * hourlyRate);
  }

  // Обновление состояния фарминга
  updateFarmingState(nftAddress: string, isStaking: boolean) {
    this.farmingState[nftAddress] = {
      isStaking,
      startTime: isStaking ? Date.now() : 0
    };
    this.saveFarmingState();
  }

  // Запустить фарминг для всех NFT
  async startAllFarming(nfts: NFT[]): Promise<void> {
    // Фильтруем только те NFT, которые не находятся в процессе фарминга
    const availableForFarming = nfts.filter(nft => {
      const farmingData = this.farmingState[nft.address];
      return !farmingData?.isStaking;
    });

    if (availableForFarming.length === 0) return;

    for (const nft of availableForFarming) {
      await this.startFarming(nft.address);
    }
  }

  // Получить состояние фарминга для NFT
  getFarmingState(nftAddress: string) {
    return this.farmingState[nftAddress];
  }

  // Получить фон из NFT
  async getNFTBackground(nft: NFT): Promise<{ color: string; pattern?: string; image?: string }> {
    try {
      // Проверяем наличие метаданных
      if (!nft.metadata?.attributes) {
        console.log('Нет атрибутов в метаданных:', nft.metadata);
        return { color: '#1e3a8a' };
      }

      console.log('Атрибуты NFT:', nft.metadata.attributes);

      // Ищем атрибуты фона в разных форматах
      const backgroundAttr = nft.metadata.attributes.find(attr => {
        const traitType = attr.trait_type?.toLowerCase() || '';
        const name = attr.name?.toLowerCase() || '';
        const value = attr.value?.toLowerCase() || '';
        
        console.log('Проверяем атрибут:', { traitType, name, value });
        
        return (
          traitType.includes('background') ||
          traitType.includes('bg') ||
          traitType.includes('backdrop') ||
          name.includes('background') ||
          name.includes('bg') ||
          name.includes('backdrop') ||
          value.includes('background') ||
          value.includes('bg') ||
          value.includes('backdrop')
        );
      });

      console.log('Найденный атрибут фона:', backgroundAttr);

      // Ищем паттерн в разных форматах
      const patternAttr = nft.metadata.attributes.find(attr => {
        const traitType = attr.trait_type?.toLowerCase() || '';
        const name = attr.name?.toLowerCase() || '';
        const value = attr.value?.toLowerCase() || '';
        
        return (
          traitType.includes('pattern') ||
          traitType.includes('texture') ||
          traitType.includes('backdrop_pattern') ||
          name.includes('pattern') ||
          name.includes('texture') ||
          name.includes('backdrop_pattern') ||
          value.includes('pattern') ||
          value.includes('texture') ||
          value.includes('backdrop_pattern')
        );
      });

      console.log('Найденный атрибут паттерна:', patternAttr);

      // Ищем фоновое изображение в разных форматах
      const imageAttr = nft.metadata.attributes.find(attr => {
        const traitType = attr.trait_type?.toLowerCase() || '';
        const name = attr.name?.toLowerCase() || '';
        const value = attr.value?.toLowerCase() || '';
        
        return (
          traitType.includes('background_image') ||
          traitType.includes('bg_image') ||
          traitType.includes('backdrop_image') ||
          traitType.includes('background_url') ||
          traitType.includes('bg_url') ||
          traitType.includes('backdrop_url') ||
          name.includes('background_image') ||
          name.includes('bg_image') ||
          name.includes('backdrop_image') ||
          name.includes('background_url') ||
          name.includes('bg_url') ||
          name.includes('backdrop_url') ||
          value.includes('background_image') ||
          value.includes('bg_image') ||
          value.includes('backdrop_image') ||
          value.includes('background_url') ||
          value.includes('bg_url') ||
          value.includes('backdrop_url')
        );
      });

      console.log('Найденный атрибут изображения:', imageAttr);

      // Если нашли цвет фона, используем его
      if (backgroundAttr?.value) {
        const colorValue = backgroundAttr.value.toLowerCase();
        console.log('Проверяем цвет:', colorValue);

        // Проверяем, является ли значение цветом в HEX или RGB формате
        const isHexOrRgb = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue) || 
                          /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(colorValue) ||
                          /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[\d.]+\)$/.test(colorValue);

        if (isHexOrRgb) {
          return {
            color: colorValue,
            pattern: patternAttr?.value,
            image: imageAttr?.value
          };
        }

        // Если это текстовое название цвета, ищем его в маппинге
        const mappedColor = this.colorMap[colorValue];
        if (mappedColor) {
          console.log('Найден маппинг цвета:', mappedColor);
          return {
            color: mappedColor,
            pattern: patternAttr?.value,
            image: imageAttr?.value
          };
        }
      }

      // Если цвет не найден или не является валидным цветом, используем дефолтный
      return { 
        color: '#1e3a8a',
        pattern: patternAttr?.value,
        image: imageAttr?.value
      };
    } catch (error) {
      console.error('Ошибка при получении фона:', error);
      return { color: '#1e3a8a' };
    }
  }
}

export default new NFTService(); 