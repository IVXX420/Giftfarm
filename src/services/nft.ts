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
    this.apiEndpoint = import.meta.env.VITE_TON_ENDPOINT.replace(/\/$/, '');
    this.apiKey = import.meta.env.VITE_TON_API_KEY;
    this.loadFarmingState();
  }

  private async makeRequest(url: string) {
    console.log('Making request to:', url);
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
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
      const data = await this.makeRequest(`${this.apiEndpoint}/nft/searchItems?owner=${userAddress}&limit=1000&offset=0`);
      const nfts = data.items || [];
      console.log('All NFTs:', nfts);

      // Фильтруем только NFT из поддерживаемых коллекций
      const supportedNFTs = nfts.filter((nft: any) => {
        const isSupported = SUPPORTED_COLLECTIONS.some(collection => 
          collection.address === nft.collection?.address
        );
        console.log('NFT:', nft.address, 'Collection:', nft.collection?.address, 'Is supported:', isSupported);
        return isSupported;
      });
      console.log('Supported NFTs:', supportedNFTs);

      // Получаем метаданные для каждого NFT
      const nftsWithMetadata = await Promise.all(
        supportedNFTs.map(async (nft: any) => {
          const farmingData = this.farmingState[nft.address] || { isStaking: false };
          
          return {
            address: nft.address,
            collectionAddress: nft.collection?.address,
            metadata: {
              name: nft.metadata?.name || 'Unnamed NFT',
              description: nft.metadata?.description || '',
              image: nft.metadata?.image || '',
              attributes: nft.metadata?.attributes || [],
            },
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
    const elapsedHours = (now - farmingData.startTime) / (1000 * 60 * 60);
    const maxHours = 12;
    const hourlyRate = 1;

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
}

export default new NFTService(); 