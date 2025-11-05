import { useCallback } from 'react';

export const useTurkishNumberFormat = () => {
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