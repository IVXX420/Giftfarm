import React, { useEffect, useRef } from 'react';

interface StatsPanelProps {
  totalGift: number;
  totalNFTs: number;
  farmingNFTs: number;
  isSubscribed: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  totalGift,
  totalNFTs,
  farmingNFTs,
  isSubscribed,
}) => {
  const giftRef = useRef<HTMLSpanElement>(null);
  const nftsRef = useRef<HTMLSpanElement>(null);
  const farmingRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animateValue = (element: HTMLSpanElement | null, start: number, end: number, duration: number) => {
      if (!element) return;

      const startTime = performance.now();
      const updateValue = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentValue = Math.round(start + (end - start) * progress);
        element.textContent = currentValue.toString();

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
    };

    animateValue(giftRef.current, 0, totalGift, 1000);
    animateValue(nftsRef.current, 0, totalNFTs, 1000);
    animateValue(farmingRef.current, 0, farmingNFTs, 1000);
  }, [totalGift, totalNFTs, farmingNFTs]);

  return (
    <div 
      className="glass-panel p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 animate-fade-in-up"
      role="region"
      aria-label="Статистика"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Баланс GIFT */}
        <div 
          className="card-hover p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          role="status"
          aria-label="Баланс GIFT"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Баланс GIFT</h3>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center animate-float">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span ref={giftRef} className="text-2xl font-bold text-white animate-neon-pulse">
              0
            </span>
            <span className="ml-1 text-sm text-gray-400">GIFT</span>
          </div>
        </div>

        {/* Всего NFT */}
        <div 
          className="card-hover p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          role="status"
          aria-label="Всего NFT"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Всего NFT</h3>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center animate-float" style={{ animationDelay: '0.2s' }}>
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span ref={nftsRef} className="text-2xl font-bold text-white animate-neon-pulse" style={{ animationDelay: '0.2s' }}>
              0
            </span>
            <span className="ml-1 text-sm text-gray-400">NFT</span>
          </div>
        </div>

        {/* Фармятся NFT */}
        <div 
          className="card-hover p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20"
          role="status"
          aria-label="Фармятся NFT"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm">Фармятся NFT</h3>
            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center animate-float" style={{ animationDelay: '0.4s' }}>
              <svg className="w-4 h-4 text-pink-400 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            <span ref={farmingRef} className="text-2xl font-bold text-white animate-neon-pulse" style={{ animationDelay: '0.4s' }}>
              0
            </span>
            <span className="ml-1 text-sm text-gray-400">NFT</span>
          </div>
          {isSubscribed && (
            <div className="mt-2">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"
                role="status"
                aria-label="Премиум активен"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
                Премиум активен
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 