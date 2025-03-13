import { SUPPORTED_COLLECTIONS, NFT } from '../types/nft';
import { Address } from '@ton/core';
import SubscriptionService from './subscription';

class NFTService {
  private farmingState: { [key: string]: { isStaking: boolean; startTime: number } } = {};
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    this.apiEndpoint = import.meta.env.VITE_TON_ENDPOINT;
    this.apiKey = import.meta.env.VITE_TON_API_KEY;
    this.loadFarmingState();
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
      
      // Проверяем наличие nft_items в ответе
      if (!data.nft_items && !data.nfts) {
        console.error('Неожиданный формат ответа API:', data);
        return [];
      }

      const nfts = data.nft_items || data.nfts || [];
      console.log('Обработанные NFT из ответа:', nfts);
      return nfts;
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

  // Собрать награду с NFT
  async collectReward(nftAddress: string): Promise<number> {
    const farmingData = this.farmingState[nftAddress];
    if (!farmingData || !farmingData.isStaking) return 0;

    const reward = this.calculateAccumulatedGift(nftAddress);
    delete this.farmingState[nftAddress];
    this.saveFarmingState();

    return reward;
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
    for (const nft of nfts) {
      if (!this.farmingState[nft.address]?.isStaking) {
        await this.startFarming(nft.address);
      }
    }
  }

  // Собрать награды со всех NFT
  async collectAllRewards(nfts: NFT[]): Promise<number> {
    let totalRewards = 0;
    for (const nft of nfts) {
      if (this.farmingState[nft.address]?.isStaking) {
        const reward = await this.collectReward(nft.address);
        totalRewards += reward;
      }
    }
    return totalRewards;
  }
}

export default new NFTService(); 