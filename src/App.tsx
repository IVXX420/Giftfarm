import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './pages/Home';

// Временные компоненты-заглушки для страниц
const NFTList = () => <div>Список NFT</div>;
const Profile = () => <div>Профиль</div>;

const AppContainer = styled.div`
  max-width: 100%;
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
`;

const App: React.FC = () => {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nft" element={<NFTList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppContainer>
  );
};

export default App; 