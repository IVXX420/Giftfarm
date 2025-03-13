import { TonClient } from '@ton/ton';
import { SUPPORTED_COLLECTIONS, NFT } from '../types/nft';

// Локальное хранилище для фарминга
interface FarmingState {
  [nftAddress: string]: {
    isStaking: boolean;
    startTime: number;
    lastCollectTime?: number;
  };
}

class NFTService {
  private farmingState: FarmingState = {};
  private tonClient: TonClient;
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    this.apiEndpoint = import.meta.env.VITE_TON_ENDPOINT;
    this.apiKey = import.meta.env.VITE_TON_API_KEY;
    this.tonClient = new TonClient({
      endpoint: this.apiEndpoint,
      apiKey: this.apiKey,
    });
    this.loadFarmingState();
  }

  private async makeRequest(url: string) {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
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

  // Получить все NFT пользователя
  async getUserNFTs(userAddress: string): Promise<NFT[]> {
    try {
      // Получаем NFT через API
      const data = await this.makeRequest(`${this.apiEndpoint}/v2/accounts/${userAddress}/nfts`);
      const nfts = data.nfts || [];

      // Фильтруем только NFT из поддерживаемых коллекций
      const supportedNFTs = nfts.filter((nft: any) => 
        SUPPORTED_COLLECTIONS.some(collection => 
          collection.address === nft.collection_address
        )
      );

      // Получаем метаданные для каждого NFT
      const nftsWithMetadata = await Promise.all(
        supportedNFTs.map(async (nft: any) => {
          const metadata = await this.getNFTMetadata(nft.address);
          const farmingData = this.farmingState[nft.address] || { isStaking: false };
          
          return {
            address: nft.address,
            collectionAddress: nft.collection_address,
            metadata,
            isStaking: farmingData.isStaking,
            stakingStartTime: farmingData.startTime,
            accumulatedGift: this.calculateAccumulatedGift(nft.address)
          };
        })
      );

      return nftsWithMetadata;
    } catch (error) {
      console.error('Ошибка при получении NFT:', error);
      throw error;
    }
  }

  // Получить метаданные NFT
  private async getNFTMetadata(nftAddress: string) {
    try {
      const metadata = await this.makeRequest(`${this.apiEndpoint}/v2/nfts/${nftAddress}/metadata`);
      
      return {
        name: metadata.name || 'Unnamed NFT',
        description: metadata.description || '',
        image: metadata.image || '',
        attributes: metadata.attributes || [],
      };
    } catch (error) {
      console.error('Ошибка при получении метаданных NFT:', error);
      return {
        name: 'Error loading NFT',
        description: '',
        image: '',
        attributes: [],
      };
    }
  }

  // Начать фарминг для NFT
  async startFarming(nftAddress: string): Promise<void> {
    this.farmingState[nftAddress] = {
      isStaking: true,
      startTime: Date.now(),
    };
    this.saveFarmingState();
  }

  // Собрать награду с NFT
  async collectReward(nftAddress: string): Promise<number> {
    const farmingData = this.farmingState[nftAddress];
    if (!farmingData || !farmingData.isStaking) return 0;

    const reward = this.calculateAccumulatedGift(nftAddress);
    
    // Сбрасываем фарминг
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
    const farmingTime = now - farmingData.startTime;
    const hours = Math.floor(farmingTime / (60 * 60 * 1000));
    
    // 1 токен в час, максимум 12 токенов
    return Math.min(hours, 12);
  }
}

export const nftService = new NFTService(); 