import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1923] to-[#23303F] text-white p-4">
      <Header />
      <main className="container mx-auto">
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
  );
};

export default App; 