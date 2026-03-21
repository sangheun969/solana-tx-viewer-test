import { Router } from "express";
import axios from "axios";

const router = Router();

type ExchangeRateCache = {
  rate: number;
  fetchedAt: number;
};

let exchangeRateCache: ExchangeRateCache | null = null;

const EXCHANGE_RATE_TTL_MS = 60 * 60 * 1000;
const EXCHANGE_RATE_URL =
  "https://api.frankfurter.dev/v1/latest?base=USD&symbols=KRW";

router.get("/", async (_req, res) => {
  const now = Date.now();

  try {
    if (
      exchangeRateCache &&
      now - exchangeRateCache.fetchedAt < EXCHANGE_RATE_TTL_MS
    ) {
      return res.json({
        success: true,
        rate: exchangeRateCache.rate,
        cached: true,
        stale: false,
      });
    }

    const response = await axios.get(EXCHANGE_RATE_URL, {
      timeout: 10000,
    });

    const rate = response.data?.rates?.KRW;

    if (typeof rate !== "number") {
      console.error("환율 응답 이상:", response.data);

      return res.status(502).json({
        success: false,
        message: "환율 데이터 형식이 올바르지 않습니다.",
      });
    }

    exchangeRateCache = {
      rate,
      fetchedAt: now,
    };

    return res.json({
      success: true,
      rate,
      cached: false,
      stale: false,
    });
  } catch (error) {
    console.error("환율 조회 실패:", error);

    if (exchangeRateCache) {
      return res.json({
        success: true,
        rate: exchangeRateCache.rate,
        cached: true,
        stale: true,
      });
    }

    return res.status(500).json({
      success: false,
      message: "환율 조회 실패",
    });
  }
});

export default router;
