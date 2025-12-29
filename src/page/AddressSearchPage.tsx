import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TxSummary } from "../api/solscan";
import { fetchAccountTransactions } from "../api/solscan";

const AddressSearchPage: React.FC = () => {
  const [address, setAddress] = useState("");
  const [queryAddress, setQueryAddress] = useState("");

  const [upbitConnected, setUpbitConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [upbitProfit, setUpbitProfit] = useState<number>(0);

  const onchainProfit = useMemo(() => {
    return queryAddress ? 12_340_000 : 0;
  }, [queryAddress]);

  const totalProfit = onchainProfit + upbitProfit;

  const {
    data: transactions,
    isLoading,
    isError,
    error,
  } = useQuery<TxSummary[], Error>({
    queryKey: ["accountTransactions", queryAddress],
    queryFn: () => fetchAccountTransactions(queryAddress, 10),
    enabled: !!queryAddress,
  });

  const handleSearch = () => {
    const trimmed = address.trim();
    if (!trimmed) return;
    setQueryAddress(trimmed);
  };

  const handleUpbitConnectDemo = () => {
    if (upbitConnected || connecting) return;
    setConnecting(true);

    setTimeout(() => {
      setUpbitConnected(true);
      setUpbitProfit(25_000_000);
      setConnecting(false);
    }, 900);
  };

  const shorten = (text: string, len = 6) => {
    if (!text) return "";
    if (text.length <= len * 2) return text;
    return `${text.slice(0, len)}...${text.slice(-len)}`;
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString("ko-KR");
  };

  const formatKRW = (n: number) =>
    n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 gap-6 bg-slate-950 text-slate-50">
      <h1 className="text-2xl md:text-3xl font-semibold">
        Solana 지갑 트랜잭션 조회
      </h1>

      <div className="w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="border border-slate-800 rounded-xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">총 누적 수익</div>
            <div className="mt-2 text-2xl font-semibold">
              {formatKRW(totalProfit)}원
            </div>
            <div className="mt-1 text-xs text-slate-400">
              온체인 {formatKRW(onchainProfit)}원 · 업비트{" "}
              {formatKRW(upbitProfit)}원
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl bg-slate-900 p-4">
            <div className="text-xs text-slate-400">온체인(DEX) 수익</div>
            <div className="mt-2 text-2xl font-semibold">
              {formatKRW(onchainProfit)}원
            </div>
            <div className="mt-1 text-xs text-slate-500">
              * 데모 값(지갑 분석 로직 연결 예정)
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">CEX(업비트) 수익</div>
                <div className="mt-2 text-2xl font-semibold">
                  {upbitConnected ? `+${formatKRW(upbitProfit)}원` : "미연동"}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  * 버튼 클릭 시 데모 수익 반영
                </div>
              </div>

              <button
                onClick={handleUpbitConnectDemo}
                disabled={upbitConnected || connecting}
                className={`px-3 py-2 rounded-lg text-sm font-medium border
                ${
                  upbitConnected
                    ? "border-emerald-700 bg-emerald-900/40 text-emerald-200"
                    : "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
                }
                ${connecting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {upbitConnected
                  ? "업비트 연동됨 ✔"
                  : connecting
                  ? "연동 중..."
                  : "업비트 연동"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="border border-slate-700 bg-slate-900 text-slate-50 p-2 rounded w-58 md:w-96 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Solana 지갑 주소 입력"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!address.trim()}
        >
          조회
        </button>
      </div>

      {queryAddress && (
        <div className="text-sm text-slate-300 ">
          조회 중인 주소:{" "}
          <span className="font-mono">{shorten(queryAddress, 8)}</span>
        </div>
      )}

      <div className="w-full max-w-4xl px-4 mt-3">
        {isLoading && (
          <div className="text-center text-slate-400">불러오는 중...</div>
        )}
        {isError && (
          <div className="text-center text-red-400">
            에러 발생: {error?.message}
          </div>
        )}
        {transactions && transactions.length === 0 && !isLoading && (
          <div className="text-center text-slate-400">트랜잭션이 없습니다.</div>
        )}
        {transactions && transactions.length > 0 && (
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="md:px-3 px-2 py-2 text-left">Tx Hash</th>
                  <th className="md:px-3 px-2 py-2 text-left">시간</th>
                  <th className="md:px-3 px-2 py-2 text-right">
                    Fee (lamports)
                  </th>
                  <th className="md:px-3 px-2 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.txHash}
                    className="border-t border-slate-800 hover:bg-slate-800/60"
                  >
                    <td className="md:px-3 px-2 py-2 font-mono">
                      <a
                        href={`https://solscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {shorten(tx.txHash, 6)}
                      </a>
                    </td>
                    <td className="md:px-3 px-2 py-2">
                      {tx.blockTime ? formatTime(tx.blockTime) : "-"}
                    </td>
                    <td className="md:px-3 px-2 py-2 text-right">
                      {tx.fee ? tx.fee.toLocaleString() : "-"}
                    </td>
                    <td className="md:px-3 px-2 py-2">
                      {tx.status === "Success" ? (
                        <span className="px-2 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs">
                          Success
                        </span>
                      ) : tx.status ? (
                        <span className="px-2 py-1 rounded-full bg-red-900/60 text-red-300 text-xs">
                          {tx.status}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ 시연용 한 줄 (원하면 제거 가능) */}
        <div className="mt-4 text-center text-xs text-slate-500">
          * “업비트 연동”은 현재 데모 연출이며, 실제 API 연동은 추후 단계에서
          적용됩니다.
        </div>
      </div>
    </div>
  );
};

export default AddressSearchPage;
