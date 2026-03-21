import { fetchSolBalance } from "./solscan";

export interface WalletValueResult {
  solBalance: number;
  solPriceUsd: number;
  totalUsd: number;
}

export async function calculateWalletValue(
  address: string,
  solPriceUsd: number,
): Promise<WalletValueResult> {
  if (!address) {
    return {
      solBalance: 0,
      solPriceUsd: 0,
      totalUsd: 0,
    };
  }

  try {
    const solBalance = await fetchSolBalance(address);
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
      solPriceUsd,
      totalUsd: 0,
    };
  }
}
