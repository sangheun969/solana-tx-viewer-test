// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// 👉 현재는 고정 환율 사용 (429 대응)
const FALLBACK_USD_KRW_RATE = 1506.2;

// type ExchangeRateResponse = {
//   success: boolean;
//   rate: number;
//   message?: string;
// };

/**
 * USD → KRW 환율 조회
 *
 * 현재는 429 오류 방지를 위해 고정값 사용
 * 추후 API 복구 시 try/catch 로직 다시 활성화 예정
 */
export async function fetchUsdKrwRate(): Promise<number> {
  return FALLBACK_USD_KRW_RATE;
}

/**
 * 🔥 나중에 다시 사용할 API 버전 (주석 유지 추천)
 */
// export async function fetchUsdKrwRate(): Promise<number> {
//   try {
//     const { data } = await axios.get<ExchangeRateResponse>(
//       `${API_BASE_URL}/api/exchange-rate`,
//     );
//
//     if (!data.success || typeof data.rate !== "number") {
//       return FALLBACK_USD_KRW_RATE;
//     }
//
//     return data.rate;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response?.status === 429) {
//       console.warn(
//         `환율 API 429 발생 -> fallback 환율 ${FALLBACK_USD_KRW_RATE} 적용`,
//       );
//       return FALLBACK_USD_KRW_RATE;
//     }
//
//     console.error("환율 조회 실패:", error);
//     return FALLBACK_USD_KRW_RATE;
//   }
// }
