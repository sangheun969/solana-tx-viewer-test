import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const FALLBACK_USD_KRW_RATE = 1506;

type ExchangeRateResponse = {
  success: boolean;
  rate: number;
  message?: string;
};

export async function fetchUsdKrwRate(): Promise<number> {
  try {
    const { data } = await axios.get<ExchangeRateResponse>(
      `${API_BASE_URL}/api/exchange-rate`,
    );

    if (!data.success || typeof data.rate !== "number") {
      return FALLBACK_USD_KRW_RATE;
    }

    return data.rate;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.warn(
        `환율 API 429 발생 -> fallback 환율 ${FALLBACK_USD_KRW_RATE} 적용`,
      );
      return FALLBACK_USD_KRW_RATE;
    }

    console.error("환율 조회 실패:", error);
    return FALLBACK_USD_KRW_RATE;
  }
}
