import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (tonConnectUI.account) {
      navigate('/dashboard');
    }
  }, [tonConnectUI.account, navigate]);

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      navigate('/');
      toast.success('Кошелёк успешно отключен! 👋', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      console.error('Ошибка отключения:', error);
      toast.error('Ошибка при отключении кошелька 😕', {
        theme: 'dark',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1923] via-[#1A2634] to-[#23303F] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923]/50 to-transparent"></div>
      
      <div className="relative z-10">
        <Header onDisconnect={handleDisconnect} />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <Routes>
            <Route path="/" element={
              tonConnectUI.account ? <Navigate to="/dashboard" replace /> : <Dashboard />
            } />
            <Route path="/dashboard" element={
              tonConnectUI.account ? <Dashboard /> : <Navigate to="/" replace />
            } />
          </Routes>
        </main>
      </div>
      
      <ToastContainer 
        position="top-right" 
        theme="dark"
        toastClassName="!bg-[#1A2634] !border !border-[#23303F] !rounded-lg !shadow-lg"
        progressClassName="!bg-[#4F46E5]"
      />
    </div>
  );
};

export default App; 