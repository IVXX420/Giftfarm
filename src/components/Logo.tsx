import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="text-3xl animate-bounce-sm">🎁</div>
      <div className="text-2xl font-bold gradient-text tracking-wide">Gift Farm</div>
    </div>
  );
};

export default Logo; 