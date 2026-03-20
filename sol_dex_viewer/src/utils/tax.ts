export type EstimatedTaxResult = {
  realizedProfitKrw: number;
  deductionKrw: number;
  taxableBaseKrw: number;
  taxRate: number;
  estimatedTaxKrw: number;
};

export const calculateEstimatedTax = (
  realizedProfitKrw: number,
): EstimatedTaxResult => {
  const deductionKrw = 2_500_000;
  const taxRate = 0.22;

  const taxableBaseKrw = Math.max(0, realizedProfitKrw - deductionKrw);
  const estimatedTaxKrw = Math.max(0, taxableBaseKrw * taxRate);

  return {
    realizedProfitKrw,
    deductionKrw,
    taxableBaseKrw,
    taxRate,
    estimatedTaxKrw,
  };
};
