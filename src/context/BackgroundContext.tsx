import React, { createContext, useContext, useState, useEffect } from 'react';

interface BackgroundImage {
  color: string;
  pattern?: string;
  image?: string;
}

interface BackgroundContextType {
  backgroundImage: BackgroundImage | null;
  sourceNFTAddress: string | null;
  setBackgroundImage: (background: BackgroundImage | null, sourceNFTAddress: string | null) => void;
  resetBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BACKGROUND: 'backgroundImage',
  SOURCE_NFT: 'sourceNFTAddress'
} as const;

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundImage, setBackgroundImageState] = useState<BackgroundImage | null>(null);
  const [sourceNFTAddress, setSourceNFTAddress] = useState<string | null>(null);

  // Загружаем сохраненный фон при инициализации
  useEffect(() => {
    try {
      const savedBackground = localStorage.getItem(STORAGE_KEYS.BACKGROUND);
      const savedSourceNFT = localStorage.getItem(STORAGE_KEYS.SOURCE_NFT);
      
      if (savedBackground) {
        const parsedBackground = JSON.parse(savedBackground) as BackgroundImage;
        
        // Проверяем валидность данных
        if (parsedBackground && typeof parsedBackground.color === 'string') {
          console.log('Загружен сохраненный фон:', parsedBackground);
          setBackgroundImageState(parsedBackground);
          
          if (savedSourceNFT) {
            setSourceNFTAddress(savedSourceNFT);
          }
        } else {
          console.error('Некорректные данные фона в localStorage');
          localStorage.removeItem(STORAGE_KEYS.BACKGROUND);
          localStorage.removeItem(STORAGE_KEYS.SOURCE_NFT);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке сохраненного фона:', error);
      // Очищаем некорректные данные
      localStorage.removeItem(STORAGE_KEYS.BACKGROUND);
      localStorage.removeItem(STORAGE_KEYS.SOURCE_NFT);
    }
  }, []);

  // Сохраняем фон при изменении
  useEffect(() => {
    try {
      if (backgroundImage) {
        localStorage.setItem(STORAGE_KEYS.BACKGROUND, JSON.stringify(backgroundImage));
        if (sourceNFTAddress) {
          localStorage.setItem(STORAGE_KEYS.SOURCE_NFT, sourceNFTAddress);
        }
        console.log('Сохранен новый фон:', backgroundImage, 'от NFT:', sourceNFTAddress);
      } else {
        localStorage.removeItem(STORAGE_KEYS.BACKGROUND);
        localStorage.removeItem(STORAGE_KEYS.SOURCE_NFT);
        console.log('Фон удален из сохранения');
      }
    } catch (error) {
      console.error('Ошибка при сохранении фона:', error);
    }
  }, [backgroundImage, sourceNFTAddress]);

  const handleSetBackgroundImage = (newBackground: BackgroundImage | null, newSourceNFTAddress: string | null) => {
    try {
      console.log('Устанавливаем новый фон:', newBackground, 'от NFT:', newSourceNFTAddress);
      
      // Проверяем валидность данных
      if (newBackground && typeof newBackground.color !== 'string') {
        throw new Error('Некорректные данные фона');
      }
      
      setBackgroundImageState(newBackground);
      setSourceNFTAddress(newSourceNFTAddress);
    } catch (error) {
      console.error('Ошибка при установке фона:', error);
      // Сбрасываем фон в случае ошибки
      setBackgroundImageState(null);
      setSourceNFTAddress(null);
    }
  };

  const resetBackground = () => {
    try {
      console.log('Сбрасываем фон');
      setBackgroundImageState(null);
      setSourceNFTAddress(null);
    } catch (error) {
      console.error('Ошибка при сбросе фона:', error);
    }
  };

  return (
    <BackgroundContext.Provider value={{ 
      backgroundImage, 
      sourceNFTAddress,
      setBackgroundImage: handleSetBackgroundImage,
      resetBackground 
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground должен использоваться внутри BackgroundProvider');
  }
  return context;
}; 