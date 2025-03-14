import React, { useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useTonConnectUI } from '@tonconnect/ui-react';
import 'react-toastify/dist/ReactToastify.css';
import { manifestUrl } from './config/ton';
import { BackgroundProvider } from './context/BackgroundContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

interface AppProps {
  onError?: (error: Error) => void;
}

const App: React.FC<AppProps> = ({ onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tonConnectUI] = useTonConnectUI();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      toast.success('Кошелек отключен! 👋', { theme: 'dark' });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      onError?.(error as Error);
    }
  };

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <BackgroundProvider>
        {isLoading ? (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
            <Header onDisconnect={handleDisconnect} />
            <Routes>
              <Route path="/dashboard" element={<Dashboard onError={onError} />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        )}
        <ToastContainer position="bottom-right" theme="dark" />
      </BackgroundProvider>
    </TonConnectUIProvider>
  );
};

export default App; 