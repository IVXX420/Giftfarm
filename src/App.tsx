import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import './styles/animations.css';
import './styles/globals.css';

const manifestUrl = 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json';

const App: React.FC = () => {
  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram WebApp
    const w = window as Window & typeof globalThis & { Telegram?: { WebApp: any } };
    const tg = w.Telegram?.WebApp;
    
    if (tg) {
      // Настраиваем Telegram WebApp
      tg.ready();
      tg.expand();
      
      // Устанавливаем цвета
      tg.setHeaderColor('#1a1b1e');
      tg.setBackgroundColor('#0f1114');
    }
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Глобальные уведомления */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="toast-container"
          />
        </div>
      </Router>
    </TonConnectUIProvider>
  );
};

export default App; 