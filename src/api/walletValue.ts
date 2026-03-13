import { fetchSolBalance } from "./solscan";
import { fetchSolPriceUsd } from "./price";

export interface WalletValueResult {
  solBalance: number;
  solPriceUsd: number;
  totalUsd: number;
}

export async function calculateWalletValue(
  address: string,
): Promise<WalletValueResult> {
  if (!address) {
    return {
      solBalance: 0,
      solPriceUsd: 0,
      totalUsd: 0,
    };
  }

  try {
    const [solBalance, solPriceUsd] = await Promise.all([
      fetchSolBalance(address),
      fetchSolPriceUsd(),
    ]);

    const totalUsd = solBalance * solPriceUsd;

    return {
      solBalance,
      solPriceUsd,
      totalUsd,
    };
  } catch (error) {
    console.error("지갑 가치 계산 오류:", error);

    return {
      solBalance: 0,
      solPriceUsd: 0,
      totalUsd: 0,
    };
  }
}
