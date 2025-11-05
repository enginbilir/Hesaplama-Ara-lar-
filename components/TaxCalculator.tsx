import React, { useState } from 'react';
import type { CalculationResult } from '../types';
import { useTurkishNumberFormat } from '../hooks/useTurkishNumberFormat';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

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
    // Sadece rakam, virgül ve noktaya izin ver
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

export default TaxCalculator;