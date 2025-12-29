import axios from "axios";

const HELIUS_BASE_URL = "https://api-mainnet.helius-rpc.com";
const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY;

if (!HELIUS_API_KEY) {
  console.error("VITE_HELIUS_API_KEY is missing");
}
export interface TxSummary {
  txHash: string;
  blockTime?: number | null;
  fee?: number;
  status?: string;
}

export async function fetchAccountTransactions(
  address: string,
  limit = 10
): Promise<TxSummary[]> {
  if (!address) return [];

  if (!HELIUS_API_KEY) {
    console.warn("Helius API Key가 없습니다. .env에 VITE_HELIUS_API_KEY 확인.");
    return [];
  }

  const url = `${HELIUS_BASE_URL}/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;

  try {
    const res = await axios.get(url);

    const data = res.data;

    if (!Array.isArray(data)) {
      console.warn("응답 형식이 예상과 다릅니다:", res.data);
      return [];
    }
    return data.map((tx: any) => ({
      txHash: tx.signature,
      blockTime: tx.timestamp ?? null,
      fee: tx.fee,
      status: tx.transactionError ? "Failed" : "Success",
    }));
  } catch (err: any) {
    console.error("Helius API 호출 오류:", err.response?.data || err);
    throw new Error(
      `${err.response?.status} : ${JSON.stringify(err.response?.data)}`
    );
  }
}
