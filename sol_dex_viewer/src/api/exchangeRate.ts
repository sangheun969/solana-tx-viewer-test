const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ExchangeRateResponse = {
  success?: boolean;
  rate?: number;
  rates?: {
    KRW?: number;
  };
  message?: string;
};

export const fetchUsdKrwRate = async (): Promise<number> => {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/exchange-rate`
    : "https://open.er-api.com/v6/latest/USD";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`환율 요청 실패: ${res.status}`);
  }

  const data: ExchangeRateResponse = await res.json();

  const rate = API_BASE_URL ? data.rate : data?.rates?.KRW;

  if (typeof rate !== "number") {
    throw new Error(data.message || "환율 없음");
  }

  return rate;
};
