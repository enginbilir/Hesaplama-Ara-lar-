
export interface CalculationResult {
  basePrice: number;
  sct: number; // Special Consumption Tax (ÖTV)
  vat: number; // Value Added Tax (KDV)
  verificationTotal: number;
}
