import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';

interface AiSummarizerProps {
  onBack: () => void;
}

const AiSummarizer: React.FC<AiSummarizerProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Lütfen özetlenecek bir metin girin.');
      return;
    }
    
    if (!process.env.API_KEY) {
        setError('API anahtarı bulunamadı. Lütfen Netlify ortam değişkenlerini kontrol edin.');
        return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Aşağıdaki metni özetle: ${inputText}`,
      });
      setResult(response.text);
    } catch (err) {
      console.error(err);
      setError('Özetleme sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-xl font-bold text-slate-100 ml-4">AI Metin Özetleyici</h1>
      </div>

      <form onSubmit={handleSummarize} className="space-y-6">
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-slate-400 mb-2">
            Özetlenecek Metin
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Buraya uzun bir metin yapıştırın..."
            className="w-full bg-slate-900/50 border border-slate-600 rounded-lg py-3 px-4 text-slate-100 text-base focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all min-h-[150px]"
            rows={6}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors transform active:scale-95 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={!inputText || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Özetleniyor...
            </>
          ) : 'Özetle'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
            {error}
        </div>
      )}

      {result && (
        <div className="mt-8 pt-6 border-t border-slate-700 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Özet Sonucu</h2>
          <div className="space-y-3 text-slate-300 bg-slate-900/30 p-4 rounded-md whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSummarizer;