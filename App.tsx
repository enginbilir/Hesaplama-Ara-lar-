
import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import TaxCalculator from './components/TaxCalculator';

export enum Screen {
  MainMenu,
  TaxCalculator,
}

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.MainMenu);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.TaxCalculator:
        return <TaxCalculator onBack={() => setActiveScreen(Screen.MainMenu)} />;
      case Screen.MainMenu:
      default:
        return <MainMenu onSelectCalculator={() => setActiveScreen(Screen.TaxCalculator)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
