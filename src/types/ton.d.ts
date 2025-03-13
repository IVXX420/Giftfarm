interface TonKeeper {
  ready: boolean;
  account: {
    address: string;
    chain: string;
  } | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

declare global {
  interface Window {
    tonkeeper?: TonKeeper;
  }
} 