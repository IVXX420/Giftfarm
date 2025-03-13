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
  isSubscribed
}) => {
  const prevGiftRef = useRef(totalGift);
  const giftDisplayRef = useRef(totalGift);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const animateValue = () => {
      const diff = totalGift - giftDisplayRef.current;
      const step = diff * 0.1; // Скорость анимации

      if (Math.abs(diff) < 0.001) {
        giftDisplayRef.current = totalGift;
        prevGiftRef.current = totalGift;
      } else {
        giftDisplayRef.current += step;
        animationFrameRef.current = requestAnimationFrame(animateValue);
      }
    };

    if (prevGiftRef.current !== totalGift) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animateValue();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [totalGift]);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-2 sm:p-4 text-center relative overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2 relative z-10">Баланс GIFT</p>
        <div className="flex flex-col relative z-10">
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {giftDisplayRef.current.toFixed(3)}
          </p>
          {isSubscribed && (
            <div className="flex items-center justify-center mt-1">
              <span className="text-[10px] sm:text-xs text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                x1.5 бонус
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-2 sm:p-4 text-center relative overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2 relative z-10">Всего NFT</p>
        <div className="flex items-center justify-center relative z-10">
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {totalNFTs}
          </p>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
      <div className="backdrop-blur-md bg-black/30 rounded-xl p-2 sm:p-4 text-center relative overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2 relative z-10">Фармится</p>
        <div className="flex items-center justify-center relative z-10">
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text">
            {farmingNFTs}
          </p>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-emerald-400 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 