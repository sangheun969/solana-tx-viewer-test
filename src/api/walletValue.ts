import { fetchSolBalance, fetchTokenBalances } from "./solscan";
import { fetchSolPriceUsd, fetchTokenPriceUsd, fetchUsdToKrw } from "./price";

export interface WalletValueResult {
  totalUsd: number;
  totalKrw: number;
}

export async function calculateWalletValue(
  address: string,
): Promise<WalletValueResult> {
  const [solBalance, tokenBalances, solPriceUsd, usdToKrw] = await Promise.all([
    fetchSolBalance(address),
    fetchTokenBalances(address),
    fetchSolPriceUsd(),
    fetchUsdToKrw(),
  ]);

  let totalUsd = solBalance * solPriceUsd;

  for (const token of tokenBalances) {
    const tokenPriceUsd = await fetchTokenPriceUsd(token.mint);
    totalUsd += token.amount * tokenPriceUsd;
  }

  return {
    totalUsd,
    totalKrw: totalUsd * usdToKrw,
  };
}
