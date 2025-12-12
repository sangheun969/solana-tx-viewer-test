import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TxSummary } from "../api/solscan";
import { fetchAccountTransactions } from "../api/solscan";

const AddressSearchPage: React.FC = () => {
  const [address, setAddress] = useState("");
  const [queryAddress, setQueryAddress] = useState("");

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

  const shorten = (text: string, len = 6) => {
    if (!text) return "";
    if (text.length <= len * 2) return text;
    return `${text.slice(0, len)}...${text.slice(-len)}`;
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString("ko-KR");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 gap-6 bg-slate-950 text-slate-50">
      <h1 className="text-2xl md:text-3xl font-semibold">
        Solana 지갑 트랜잭션 조회
      </h1>
      <div className="flex gap-2 mt-4">
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
      <div className="w-full max-w-4xl px-4 mt-6">
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
                  <th className="px-3 py-2 text-left">Tx Hash</th>
                  <th className="px-3 py-2 text-left">시간</th>
                  <th className="px-3 py-2 text-right">Fee (lamports)</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.txHash}
                    className="border-t border-slate-800 hover:bg-slate-800/60"
                  >
                    <td className="px-3 py-2 font-mono">
                      <a
                        href={`https://solscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {shorten(tx.txHash, 6)}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      {tx.blockTime ? formatTime(tx.blockTime) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {tx.fee ? tx.fee.toLocaleString() : "-"}
                    </td>
                    <td className="px-3 py-2">
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
      </div>
    </div>
  );
};

export default AddressSearchPage;
