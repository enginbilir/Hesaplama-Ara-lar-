import React from 'react';
import { CalendarIcon } from '@/components/icons/CalendarIcon';
import { SparklesIcon } from '@/components/icons/SparklesIcon';

interface MainMenuProps {
  onSelectCalculator: () => void;
  onSelectPolicyCalculator: () => void;
  onSelectAiSummarizer: () => void;
}

const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
    </svg>
);

const MainMenu: React.FC<MainMenuProps> = ({ onSelectCalculator, onSelectPolicyCalculator, onSelectAiSummarizer }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-2 text-center">Hesaplama Araçları</h1>
      <p className="text-slate-400 mb-8 text-center">Lütfen yapmak istediğiniz işlemi seçin.</p>
      
      <div className="w-full space-y-4">
        <button
          onClick={onSelectCalculator}
          className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          aria-label="ÖTV ve KDV Ayırıcı"
        >
          <CalculatorIcon />
          <div className="text-left">
            <h2 className="text-lg font-semibold text-slate-100">ÖTV ve KDV Ayırıcı</h2>
            <p className="text-slate-400 text-sm">Toplam tutar içerisinden ÖTV ve KDV'yi ayırır.</p>
          </div>
        </button>

        <button
          onClick={onSelectPolicyCalculator}
          className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          aria-label="Poliçe Dönem Hesaplayıcı"
        >
          <CalendarIcon />
          <div className="text-left">
            <h2 className="text-lg font-semibold text-slate-100">Poliçe Dönem Hesaplayıcı</h2>
            <p className="text-slate-400 text-sm">Tarih aralığına göre tutarı çeyreklere dağıtır.</p>
          </div>
        </button>
        
        <button
          onClick={onSelectAiSummarizer}
          className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
          aria-label="AI Metin Özetleyici"
        >
          <SparklesIcon />
          <div className="text-left">
            <h2 className="text-lg font-semibold text-slate-100">AI Metin Özetleyici</h2>
            <p className="text-slate-400 text-sm">Uzun metinleri Gemini AI ile özetleyin.</p>
          </div>
        </button>
      </div>

       <div className="mt-12 text-center text-xs text-slate-500">
          <p>Gelecekte daha fazla hesaplama aracı eklenecektir.</p>
        </div>
    </div>
  );
};

export default MainMenu;