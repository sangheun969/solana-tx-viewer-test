import axios from "axios";

export async function fetchSolPriceUsd(): Promise<number> {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "solana",
          vs_currencies: "usd",
        },
      },
    );

    return res.data?.solana?.usd ?? 0;
  } catch (err) {
    console.error("SOL 가격 조회 오류:", err);
    return 0;
  }
}

export async function fetchTokenPriceUsd(mint: string): Promise<number> {
  if (!mint) return 0;

  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/token_price/solana",
      {
        params: {
          contract_addresses: mint,
          vs_currencies: "usd",
        },
      },
    );

    return res.data?.[mint?.toLowerCase()]?.usd ?? 0;
  } catch (err) {
    console.error("토큰 가격 조회 오류:", mint, err);
    return 0;
  }
}

export async function fetchUsdToKrw(): Promise<number> {
  try {
    const res = await axios.get("https://api.exchangerate.host/latest", {
      params: {
        base: "USD",
        symbols: "KRW",
      },
    });

    return res.data?.rates?.KRW ?? 0;
  } catch (err) {
    console.error("환율 조회 오류:", err);
    return 0;
  }
}
