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
  private apiEndpoint: string;
  private apiKey: string;

  constructor() {
    this.apiEndpoint = import.meta.env.VITE_TON_ENDPOINT;
    this.apiKey = import.meta.env.VITE_TON_API_KEY;
    this.loadFarmingState();
  }

  private async makeRequest(url: string) {
    console.log('Making request to:', url);
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
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
      console.log('Getting NFTs for address:', userAddress);
      console.log('Supported collections:', SUPPORTED_COLLECTIONS);
      
      // Получаем NFT через API
      const data = await this.makeRequest(`${this.apiEndpoint}/getWalletNfts?address=${userAddress}`);
      const nfts = data.nfts || [];
      console.log('All NFTs:', nfts);

      // Фильтруем только NFT из поддерживаемых коллекций
      const supportedNFTs = nfts.filter((nft: any) => {
        const isSupported = SUPPORTED_COLLECTIONS.some(collection => 
          collection.address === nft.collection_address
        );
        console.log('NFT:', nft.address, 'Collection:', nft.collection_address, 'Is supported:', isSupported);
        return isSupported;
      });
      console.log('Supported NFTs:', supportedNFTs);

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

      console.log('NFTs with metadata:', nftsWithMetadata);
      return nftsWithMetadata;
    } catch (error) {
      console.error('Ошибка при получении NFT:', error);
      throw error;
    }
  }

  // Получить метаданные NFT
  private async getNFTMetadata(nftAddress: string) {
    try {
      console.log('Getting metadata for NFT:', nftAddress);
      const metadata = await this.makeRequest(`${this.apiEndpoint}/getNftItemMetadata?address=${nftAddress}`);
      console.log('NFT metadata:', metadata);
      
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