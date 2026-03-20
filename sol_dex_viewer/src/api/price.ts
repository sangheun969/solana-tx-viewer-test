import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
} & T;

type SolPriceData = {
  price: number;
};

type TokenPriceData = {
  price: number;
};

type UsdKrwData = {
  rate: number;
};

export async function fetchSolPriceUsd(): Promise<number> {
  try {
    const res = await axios.get<ApiResponse<SolPriceData>>(
      `${API_BASE_URL}/api/price/sol`,
      { timeout: 10000 },
    );

    if (!res.data.success || typeof res.data.price !== "number") {
      throw new Error("SOL 가격 응답 이상");
    }

    return res.data.price;
  } catch (err) {
    console.error("SOL 가격 조회 오류:", err);
    return 0;
  }
}

export async function fetchTokenPriceUsd(mint: string): Promise<number> {
  if (!mint) return 0;

  try {
    const res = await axios.get<ApiResponse<TokenPriceData>>(
      `${API_BASE_URL}/api/price/token`,
      {
        params: { mint },
        timeout: 10000,
      },
    );

    if (!res.data.success || typeof res.data.price !== "number") {
      throw new Error(`토큰 가격 응답 이상: ${mint}`);
    }

    return res.data.price;
  } catch (err) {
    console.error("토큰 가격 조회 오류:", mint, err);
    return 0;
  }
}

export async function fetchUsdToKrw(): Promise<number> {
  try {
    const res = await axios.get<ApiResponse<UsdKrwData>>(
      `${API_BASE_URL}/api/exchange/usd-krw`,
      { timeout: 10000 },
    );

    if (!res.data.success || typeof res.data.rate !== "number") {
      throw new Error("환율 응답 이상");
    }

    return res.data.rate;
  } catch (err) {
    console.error("환율 조회 오류:", err);
    return 0;
  }
}
