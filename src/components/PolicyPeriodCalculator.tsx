import React, { useState } from 'react';
import type { PolicyPeriodResult } from '@/types';
import { useTurkishNumberFormat } from '@/hooks/useTurkishNumberFormat';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

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

export default PolicyPeriodCalculator;