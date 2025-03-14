import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: 'Добро пожаловать в Gift Farm! 🎁',
      description: 'Ваш путь к пассивному доходу начинается здесь.',
      icon: '🎁'
    },
    {
      title: 'Подключите свой TON кошелек',
      description: 'Используйте TON Keeper для безопасного подключения.',
      icon: '🔐'
    },
    {
      title: 'Начните фармить GIFT',
      description: 'Каждый NFT приносит 1 GIFT в час в течение 12 часов.',
      icon: '⏳'
    }
  ];

<<<<<<< HEAD
=======
  // Отдельный эффект для обновления прогресса
>>>>>>> e49eebaea57194cdd7c7e8d3a16e8deda6ab08a6
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
<<<<<<< HEAD
          onLoadingComplete();
=======
>>>>>>> e49eebaea57194cdd7c7e8d3a16e8deda6ab08a6
          return 100;
        }
        return prev + 1;
      });
    }, 60); // 6 секунд = 6000мс, 100 шагов = 60мс на шаг

    return () => clearInterval(timer);
<<<<<<< HEAD
  }, [onLoadingComplete]);

=======
  }, []);

  // Отдельный эффект для вызова onLoadingComplete
  useEffect(() => {
    if (progress >= 100) {
      onLoadingComplete();
    }
  }, [progress, onLoadingComplete]);

  // Эффект для смены шагов
>>>>>>> e49eebaea57194cdd7c7e8d3a16e8deda6ab08a6
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // Меняем шаг каждые 2 секунды

    return () => clearInterval(stepTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 z-0 transition-all duration-500"
        style={{
          background: 'linear-gradient(to bottom, #1e3a8a, #0c4a6e)',
          opacity: 0.8
        }}
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      </div>
      
      <div className="w-full max-w-2xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white animate-pulse">
            {steps[currentStep].icon} {steps[currentStep].title}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 animate-fade-in">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {progress}%
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-white scale-125 animate-pulse' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 