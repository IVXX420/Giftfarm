import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { useTonConnect } from './hooks/useTonConnect';

const App: React.FC = () => {
  const { connected } = useTonConnect();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black animate-gradient">
      <Routes>
        <Route path="/" element={
          connected ? <Navigate to="/dashboard" /> : <Dashboard />
        } />
        <Route path="/dashboard" element={
          connected ? <Dashboard /> : <Navigate to="/" />
        } />
      </Routes>
    </div>
  );
};

export default App; 