import { Router } from "express";
import axios from "axios";

const router = Router();

type SolPriceCache = {
  price: number;
  fetchedAt: number;
};

let solPriceCache: SolPriceCache | null = null;

const SOL_PRICE_TTL_MS = 60 * 1000;
const COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price";

router.get("/sol", async (_req, res) => {
  const now = Date.now();

  try {
    if (solPriceCache && now - solPriceCache.fetchedAt < SOL_PRICE_TTL_MS) {
      return res.json({
        success: true,
        price: solPriceCache.price,
        cached: true,
        stale: false,
      });
    }

    const response = await axios.get(COINGECKO_URL, {
      params: {
        ids: "solana",
        vs_currencies: "usd",
      },
      timeout: 10000,
    });

    const price = response.data?.solana?.usd;

    if (typeof price !== "number") {
      console.error("SOL 가격 응답 이상:", response.data);

      return res.status(502).json({
        success: false,
        message: "SOL 가격 데이터 형식이 올바르지 않습니다.",
      });
    }

    solPriceCache = {
      price,
      fetchedAt: now,
    };

    return res.json({
      success: true,
      price,
      cached: false,
      stale: false,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("SOL 가격 조회 실패 (Axios)");
      console.error("message:", error.message);
      console.error("code:", error.code);
      console.error("status:", error.response?.status);
      console.error("data:", error.response?.data);

      if (error.response?.status === 429) {
        if (solPriceCache) {
          return res.json({
            success: true,
            price: solPriceCache.price,
            cached: true,
            stale: true,
          });
        }

        return res.status(429).json({
          success: false,
          message:
            "CoinGecko 호출 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    } else {
      console.error("SOL 가격 조회 실패 (Unknown):", error);
    }

    if (solPriceCache) {
      return res.json({
        success: true,
        price: solPriceCache.price,
        cached: true,
        stale: true,
      });
    }

    return res.status(500).json({
      success: false,
      message: "가격 조회 실패",
    });
  }
});

export default router;
