import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import Dashboard from './components/Dashboard';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(240, 242, 245, 0.5) 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const App: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>GIFT Farm</Title>
        <TonConnectButton />
      </Header>
      <Dashboard />
    </Container>
  );
};

export default App; 