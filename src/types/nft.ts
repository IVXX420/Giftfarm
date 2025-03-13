export interface NFTCollection {
  address: string;
  name: string;
  description?: string;
}

export interface NFT {
  address: string;
  collectionAddress: string;
  metadata: {
    name: string;
    description?: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  isStaking: boolean;
  stakingStartTime?: number;
  accumulatedGift?: number;
}

// Список поддерживаемых коллекций
export const SUPPORTED_COLLECTIONS: NFTCollection[] = [
  {
    address: "EQC6zjid8vJNEWqcXk10XjsdDLRKbcPZzbHusuEW6FokOWIm",
    name: "TON NFT Collection 1"
  },
  {
    address: "EQD6mH9bwbn6S3M_tCRWOvqAIW8M34kRwbI01niGLRPeDPsl",
    name: "TON NFT Collection 2"
  },
  {
    address: "EQBMcfMAZlMUr1W3X8kdEw3fJMUAaWH4-XcmE5R5RfFIY0E2",
    name: "TON NFT Collection 3"
  },
  {
    address: "EQDQ6DjRabTYSAxf2xrZsnsXtqcIm1bj9dF5x_h8lNjWPmH4",
    name: "TON NFT Collection 4"
  },
  {
    address: "EQCefrjhCD2_7HRIr2lmwt9ZaqeG_tdseBvADC66833kBS3y",
    name: "TON NFT Collection 5"
  },
  {
    address: "EQBD8aBKC4NsnYMqtkCfPQk2EVnieynJQp1UgZVyx1VmR5Ml",
    name: "TON NFT Collection 6"
  },
  {
    address: "EQCBK_JBASAA5XVz1D17Pn--kQaMWm0b9wReVtsEdRO4Tgy9",
    name: "TON NFT Collection 7"
  },
  {
    address: "EQAwzubeoJwnqmmBuTPpnUSurRzWPB8ERzcfzx55Z2YjE0jx",
    name: "TON NFT Collection 8"
  },
  {
    address: "EQCwEFfUbbR-22fn3VgxUpBil7bwBQqEHm7wgQYbWY9c08YJ",
    name: "TON NFT Collection 9"
  },
  {
    address: "EQAaTIR7oJyowDiumYLVN0oe61kGE3I6EPEn7WgHPGuWAeCy",
    name: "TON NFT Collection 10"
  }
]; 