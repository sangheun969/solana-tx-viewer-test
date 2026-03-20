const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUsdKrwRate = async (): Promise<number> => {
  try {
    const url = API_BASE_URL
      ? `${API_BASE_URL}/api/exchange-rate`
      : "https://open.er-api.com/v6/latest/USD";

    const res = await fetch(url);
    const data = await res.json();

    const rate = API_BASE_URL ? data.rate : data?.rates?.KRW;

    if (typeof rate !== "number") {
      throw new Error("환율 없음");
    }

    return rate;
  } catch (error) {
    console.error("환율 조회 실패:", error);
    return 1300;
  }
};
