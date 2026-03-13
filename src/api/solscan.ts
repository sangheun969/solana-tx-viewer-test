import axios from "axios";

const HELIUS_ENHANCED_API_URL = "https://api-mainnet.helius-rpc.com";
const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com";
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

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
}

export async function fetchAccountTransactions(
  address: string,
  limit = 10,
): Promise<TxSummary[]> {
  if (!address) return [];

  if (!HELIUS_API_KEY) {
    console.warn("Helius API Key가 없습니다. .env에 VITE_HELIUS_API_KEY 확인.");
    return [];
  }

  const url = `${HELIUS_ENHANCED_API_URL}/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}&limit=${limit}`;

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
      `${err.response?.status} : ${JSON.stringify(err.response?.data)}`,
    );
  }
}

export async function fetchSolBalance(address: string): Promise<number> {
  if (!address || !HELIUS_API_KEY) return 0;

  const url = `${HELIUS_RPC_URL}/?api-key=${HELIUS_API_KEY}`;

  const body = {
    jsonrpc: "2.0",
    id: "1",
    method: "getBalance",
    params: [address],
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const lamports = res.data?.result?.value ?? 0;
    return lamports / 1_000_000_000;
  } catch (err: any) {
    console.error("SOL 잔액 조회 오류:", err.response?.data || err);
    return 0;
  }
}

export async function fetchTokenBalances(
  address: string,
): Promise<TokenBalance[]> {
  if (!address || !HELIUS_API_KEY) return [];

  const url = `${HELIUS_RPC_URL}/?api-key=${HELIUS_API_KEY}`;

  const body = {
    jsonrpc: "2.0",
    id: "1",
    method: "getTokenAccountsByOwner",
    params: [
      address,
      {
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        encoding: "jsonParsed",
      },
    ],
  };

  try {
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const accounts = res.data?.result?.value ?? [];

    return accounts
      .map((item: any) => {
        const info = item?.account?.data?.parsed?.info;
        const tokenAmount = info?.tokenAmount;

        return {
          mint: info?.mint,
          amount: Number(tokenAmount?.uiAmount ?? 0),
          decimals: Number(tokenAmount?.decimals ?? 0),
        };
      })
      .filter((token: TokenBalance) => token.mint && token.amount > 0);
  } catch (err: any) {
    console.error("토큰 잔액 조회 오류:", err.response?.data || err);
    return [];
  }
}
