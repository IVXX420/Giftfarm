import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { manifestUrl } from './config/ton';
import { BackgroundProvider, useBackground } from './context/BackgroundContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

interface AppContentProps {
  onError?: (error: Error) => void;
}

const AppContent: React.FC<AppContentProps> = ({ onError }) => {
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const { backgroundImage, resetBackground } = useBackground();
  const [isLoading, setIsLoading] = useState(true);

  // Обновляем статус пользователя при подключении/отключении
  useEffect(() => {
    const updateUserStatus = async () => {
      console.log('Обновление статуса временно отключено');
    };

    if (tonConnectUI.account) {
      updateUserStatus();
    }

    // Очищаем статус при размонтировании
    return () => {
      if (tonConnectUI.account) {
        updateUserStatus();
      }
    };
  }, [tonConnectUI.account]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      navigate('/');
      resetBackground();
      toast.success('Кошелёк успешно отключен! 👋', {
        theme: 'dark',
      });
    } catch (error) {
      console.error('Ошибка отключения:', error);
      toast.error('Ошибка при отключении кошелька 😕', {
        theme: 'dark',
      });
      onError?.(error as Error);
    }
  };

  const getBackgroundStyle = () => {
    if (!backgroundImage) {
      return {
        background: 'linear-gradient(to bottom, #1e3a8a, #0c4a6e)',
        opacity: 0.8
      };
    }

    return {
      background: `linear-gradient(to bottom, ${backgroundImage.color}, ${backgroundImage.color})`,
      opacity: 0.8
    };
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      <div 
        className="fixed inset-0 z-0 transition-all duration-500"
        style={getBackgroundStyle()}
      >
        {backgroundImage?.pattern && (
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${backgroundImage.pattern})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        {backgroundImage?.image && (
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${backgroundImage.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        )}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>
      <div className="relative z-10">
        <Header onDisconnect={handleDisconnect} />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <Routes>
            <Route path="/" element={
              tonConnectUI.account ? <Navigate to="/dashboard" replace /> : <Dashboard onError={onError} />
            } />
            <Route path="/dashboard" element={
              tonConnectUI.account ? <Dashboard onError={onError} /> : <Navigate to="/" replace />
            } />
          </Routes>
        </main>
      </div>
      
      <ToastContainer 
        position="bottom-right" 
        theme="dark"
        toastClassName="!bg-[#1A2634] !border !border-[#23303F] !rounded-lg !shadow-lg"
        progressClassName="!bg-[#4F46E5]"
      />
    </div>
  );
};

interface AppProps {
  onError?: (error: Error) => void;
}

const App: React.FC<AppProps> = ({ onError }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <BackgroundProvider>
        <AppContent onError={onError} />
      </BackgroundProvider>
    </TonConnectUIProvider>
  );
};

export default App; 