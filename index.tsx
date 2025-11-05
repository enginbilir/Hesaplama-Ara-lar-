import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- START OF TYPES ---
interface CalculationResult {
  basePrice: number;
  sct: number; // Special Consumption Tax (ÖTV)
  vat: number; // Value Added Tax (KDV)
  verificationTotal: number;
}

interface PolicyPeriodResult {
  quarter: string;
  days: number;
  amount: number;
  deductible?: number;
  nonDeductible?: number;
}
// --- END OF TYPES ---


// --- START OF HOOKS ---
const useTurkishNumberFormat = () => {
  const format = useCallback((value: number | string, options?: Intl.NumberFormatOptions) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue)) {
      return '';
    }
    
    const defaultOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    };

    return new Intl.NumberFormat('tr-TR', defaultOptions).format(numericValue);
  }, []);

  return { formatTurkish: format };
};
// --- END OF HOOKS ---


// --- START OF ICONS ---
const ArrowLeftIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 10h.01M12 10h.01M15 10h.01M9 13h.01M12 13h.01M15 13h.01M4 7h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
    </svg>
);
// --- END OF ICONS ---


// --- START OF COMPONENTS ---

interface ResultRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
}

const ResultRow: React.FC<ResultRowProps> = ({ label, value, isTotal = false }) => (
    <div className="flex justify-between items-center bg-slate-900/30 p-3 rounded-md">
        <span className={`${isTotal ? 'font-bold text-sky-400' : 'text-slate-400'}`}>{label}</span>
        <span className={`${isTotal ? 'font-bold text-xl text-white' : 'font-medium text-slate-200'}`}>{value}</span>
    </div>
);

interface TaxCalculatorProps {
  onBack: () => void;
}

const TaxCalculator: React.FC<TaxCalculatorProps> = ({ onBack }) => {
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const { formatTurkish } = useTurkishNumberFormat();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(totalAmount.replace(/\./g, '').replace(',', '.'));

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setResults(null);
      return;
    }

    const SCT_RATE = 0.10; // ÖTV Oranı
    const VAT_RATE = 0.10; // KDV Oranı

    const basePrice = parsedAmount / ((1 + SCT_RATE) * (1 + VAT_RATE));
    const sct = basePrice * SCT_RATE;
    const vat = (basePrice + sct) * VAT_RATE;
    const verificationTotal = basePrice + sct + vat;

    setResults({
      basePrice,
      sct,
      vat,
      verificationTotal,
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9,.]/g, '');
    setTotalAmount(sanitizedValue);
  };

  return (
    <div className="p-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Geri"
        >
          <ArrowLeftIcon />
        </button>
        <h1 className="text-xl font-bold text-slate-100 ml-4">ÖTV & KDV Ayırıcı</h1>
      </div>

      <form onSubmit={handleCalculate} className="space-y-6">
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-slate-400 mb-2">
            Toplam Tutar (₺)
          </label>
          <div className="relative">
            <input
              type="text"
              id="totalAmount"
              value={totalAmount}
              onChange={handleInputChange}
              placeholder="Örn: 121,00"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              inputMode="decimal"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!totalAmount}
        >
          Hesapla
        </button>
      </form>

      {results && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Hesaplama Sonuçları</h2>
          <div className="space-y-3 text-slate-300">
            <ResultRow label="Mal Bedeli" value={formatTurkish(results.basePrice) + '₺'} />
            <ResultRow label="ÖTV Tutarı (%10)" value={formatTurkish(results.sct) + '₺'} />
            <ResultRow label="KDV Tutarı (%10)" value={formatTurkish(results.vat) + '₺'} />
            <hr className="border-slate-700 my-3" />
            <ResultRow label="Kontrol Toplamı" value={formatTurkish(results.verificationTotal) + '₺'} isTotal={true} />
          </div>
        </div>
      )}
    </div>
  );
};


interface PolicyPeriodCalculatorProps {
  onBack: () => void;
}

const PolicyPeriodCalculator: React.FC<PolicyPeriodCalculatorProps> = ({ onBack }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [isPassengerCar, setIsPassengerCar] = useState(false);
  const [results, setResults] = useState<PolicyPeriodResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatTurkish } = useTurkishNumberFormat();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const parsedAmount = parseFloat(totalAmount.replace(/\./g, '').replace(',', '.'));

    if (!startDate || !endDate) {
        setError('Lütfen başlangıç ve bitiş tarihlerini seçin.');
        return;
    }
    
    if (start >= end) {
      setError('Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Lütfen geçerli bir toplam tutar girin.');
      return;
    }

    const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (totalDays <= 0) return;
    
    const dailyAmount = parsedAmount / totalDays;
    const periods = new Map<string, number>();

    let currentDate = new Date(start);
    while (currentDate < end) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      const periodName = `${year} Q${quarter}`;
      periods.set(periodName, (periods.get(periodName) || 0) + 1);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const calculatedResults = Array.from(periods.entries()).map(([quarter, days]) => {
      const amount = days * dailyAmount;
      const result: PolicyPeriodResult = {
        quarter,
        days,
        amount,
      };

      if (isPassengerCar) {
        result.deductible = amount * 0.7;
        result.nonDeductible = amount * 0.3;
      }
      return result;
    }).sort((a, b) => a.quarter.localeCompare(b.quarter));

    setResults(calculatedResults);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9,.]/g, '');
    setTotalAmount(sanitizedValue);
  };
  
  const totalCalculatedAmount = results?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const totalCalculatedDays = results?.reduce((sum, item) => sum + item.days, 0) || 0;
  const totalDeductible = results?.reduce((sum, item) => sum + (item.deductible || 0), 0) || 0;
  const totalNonDeductible = results?.reduce((sum, item) => sum + (item.nonDeductible || 0), 0) || 0;

  return (
    <div className="p-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Geri"
        >
          <ArrowLeftIcon />
        </button>
        <h1 className="text-xl font-bold text-slate-100 ml-4">Poliçe Dönem Hesaplayıcı</h1>
      </div>

      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-400 mb-2">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-400 mb-2">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
            </div>
        </div>
        
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-slate-400 mb-2">
            Toplam Tutar (₺)
          </label>
          <input
            type="text"
            id="totalAmount"
            value={totalAmount}
            onChange={handleAmountChange}
            placeholder="Örn: 1000,00"
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            inputMode="decimal"
          />
        </div>

        <div className="flex items-center">
            <input
                type="checkbox"
                id="isPassengerCar"
                checked={isPassengerCar}
                onChange={(e) => setIsPassengerCar(e.target.checked)}
                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="isPassengerCar" className="ml-2 text-sm font-medium text-slate-300 cursor-pointer">
                Binek araç mı? (Gider kısıtlaması uygula)
            </label>
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!startDate || !endDate || !totalAmount}
        >
          Hesapla
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
            {error}
        </div>
      )}

      {results && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Hesaplama Sonuçları</h2>
          <div className="space-y-2">
            {isPassengerCar ? (
              <>
                <div className="grid grid-cols-4 gap-2 text-sm font-semibold text-slate-400 px-3 pb-2 border-b border-slate-700">
                  <span>Dönem</span>
                  <span className="text-right">Gün</span>
                  <span className="text-right">Gider (%70)</span>
                  <span className="text-right">KKEG (%30)</span>
                </div>
                {results.map(res => (
                  <div key={res.quarter} className="grid grid-cols-4 gap-2 bg-slate-900/30 p-3 rounded-md items-center">
                    <span className="font-medium text-slate-200">{res.quarter}</span>
                    <span className="text-right text-slate-300">{res.days}</span>
                    <span className="text-right font-mono text-slate-200">{formatTurkish(res.deductible!)}₺</span>
                    <span className="text-right font-mono text-slate-200">{formatTurkish(res.nonDeductible!)}₺</span>
                  </div>
                ))}
                <hr className="border-slate-700 my-3" />
                <div className="grid grid-cols-4 gap-2 bg-slate-900/30 p-3 rounded-md items-center font-bold">
                  <span className="text-sky-400">TOPLAM</span>
                  <span className="text-right text-white">{totalCalculatedDays}</span>
                  <span className="text-right font-mono text-white text-lg">{formatTurkish(totalDeductible)}₺</span>
                  <span className="text-right font-mono text-white text-lg">{formatTurkish(totalNonDeductible)}₺</span>
                </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-md mt-2 text-base">
                      <span className={'font-semibold text-slate-300'}>Kontrol Toplamı</span>
                      <span className={'font-bold text-lg text-slate-100'}>{formatTurkish(totalCalculatedAmount)}₺</span>
                  </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 text-sm font-semibold text-slate-400 px-3 pb-2 border-b border-slate-700">
                    <span>Dönem</span>
                    <span className="text-right">Gün Sayısı</span>
                    <span className="text-right">Tutar</span>
                </div>
                {results.map(res => (
                    <div key={res.quarter} className="grid grid-cols-3 gap-2 bg-slate-900/30 p-3 rounded-md items-center">
                        <span className="font-medium text-slate-200">{res.quarter}</span>
                        <span className="text-right text-slate-300">{res.days}</span>
                        <span className="text-right font-mono text-slate-200">{formatTurkish(res.amount)}₺</span>
                    </div>
                ))}
                <hr className="border-slate-700 my-3" />
                <div className="grid grid-cols-3 gap-2 bg-slate-900/30 p-3 rounded-md items-center font-bold">
                    <span className="text-sky-400">TOPLAM</span>
                    <span className="text-right text-white">{totalCalculatedDays}</span>
                    <span className="text-right font-mono text-white text-xl">{formatTurkish(totalCalculatedAmount)}₺</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface MainMenuProps {
  onSelectCalculator: () => void;
  onSelectPolicyCalculator: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectCalculator, onSelectPolicyCalculator }) => {
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
      </div>

       <div className="mt-12 text-center text-xs text-slate-500">
          <p>Gelecekte daha fazla hesaplama aracı eklenecektir.</p>
        </div>
    </div>
  );
};


enum Screen {
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

// --- END OF COMPONENTS ---

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Kök eleman bulunamadı.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
