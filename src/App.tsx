import React, { useState } from 'react';
import MainMenu from './components/MainMenu';
import TaxCalculator from './components/TaxCalculator';
import PolicyPeriodCalculator from './components/PolicyPeriodCalculator';

export enum Screen {
  MainMenu,
  TaxCalculator,
  PolicyPeriodCalculator,
}

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.MainMenu);

  const renderScreen = () => {
    switch (activeScreen) {
      case Screen.TaxCalculator:
        return <TaxCalculator onBack={() => setActiveScreen(Screen.MainMenu)} />;
      case Screen.PolicyPeriodCalculator:
        return <PolicyPeriodCalculator onBack={() => setActiveScreen(Screen.MainMenu)} />;
      case Screen.MainMenu:
      default:
        return (
          <MainMenu 
            onSelectCalculator={() => setActiveScreen(Screen.TaxCalculator)}
            onSelectPolicyCalculator={() => setActiveScreen(Screen.PolicyPeriodCalculator)}
          />
        );
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