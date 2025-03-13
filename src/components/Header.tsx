import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="glass-panel p-4 sm:p-6 mb-4 sm:mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl mr-2">🎁</div>
          <span className="text-2xl text-blue-400 font-bold">Gift Farm</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 