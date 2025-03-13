import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { useTonConnect } from './hooks/useTonConnect';

const App: React.FC = () => {
  const { connected } = useTonConnect();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) {
      navigate('/dashboard');
    }
  }, [connected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black animate-gradient">
      <Routes>
        <Route path="/" element={
          connected ? <Navigate to="/dashboard" replace /> : <Dashboard />
        } />
        <Route path="/dashboard" element={
          connected ? <Dashboard /> : <Navigate to="/" replace />
        } />
      </Routes>
    </div>
  );
};

export default App; 