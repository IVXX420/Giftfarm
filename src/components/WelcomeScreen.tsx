import React from 'react';
import Logo from './Logo';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="glass-panel p-6 max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-bold gradient-text mb-4">О приложении</h2>
          <p className="text-gray-300">
            Gift Farm - это платформа для фарминга GIFT токенов с помощью NFT в сети TON. 
            Подключайте свой кошелек TON Keeper и начинайте получать пассивный доход!
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold gradient-text mb-4">Как это работает</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Подключите кошелек TON Keeper</li>
            <li>• Выберите NFT из доступных коллекций</li>
            <li>• Нажмите "Начать фарм" на выбранном NFT</li>
            <li>• Получайте 1 GIFT токен в час в течение 12 часов</li>
            <li>• Собирайте накопленные токены</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold gradient-text mb-4">Преимущества премиум подписки</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Скорость фарма увеличена в 1.5 раза</li>
            <li>• Возможность запускать и собирать фарм со всех NFT одной кнопкой</li>
            <li>• Доступ к эксклюзивным коллекциям</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold gradient-text mb-4">Правила использования</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• Один NFT может фармить только один раз в 12 часов</li>
            <li>• После сбора награды нужно подождать 12 часов перед повторным фармом</li>
            <li>• Премиум подписка действует 7 дней</li>
            <li>• Все транзакции в сети TON необратимы</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default WelcomeScreen; 