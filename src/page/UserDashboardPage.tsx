import { useEffect, useMemo, useState } from "react";
import { getSavedWallets } from "../utils/walletStorage";
import type { SavedWallet } from "../types/wallet";
import { calculateWalletValue } from "../api/walletValue";
import IconBtnDown from "../assets/icons/icon_btn_down.png";
import IconBtnUp from "../assets/icons/icon_btn_up.png";

type WalletValueMap = Record<
  string,
  {
    solBalance: number;
    solPriceUsd: number;
    totalUsd: number;
  }
>;

const getAmountColorClass = (amount: number) => {
  if (amount > 0) return "text-green-500";
  if (amount < 0) return "text-red-500";
  return "text-black";
};

const UserDashboardPage = () => {
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [walletValues, setWalletValues] = useState<WalletValueMap>({});
  const [loading, setLoading] = useState(false);
  const [showAllWallets, setShowAllWallets] = useState(false);

  useEffect(() => {
    const savedWallets = getSavedWallets();
    setWallets(savedWallets);

    const loadWalletValues = async () => {
      if (savedWallets.length === 0) {
        setWalletValues({});
        return;
      }

      try {
        setLoading(true);

        const results = await Promise.all(
          savedWallets.map(async (wallet) => {
            try {
              const result = await calculateWalletValue(wallet.address);

              return {
                walletId: wallet.id,
                value: {
                  solBalance: result.solBalance ?? 0,
                  solPriceUsd: result.solPriceUsd ?? 0,
                  totalUsd: result.totalUsd ?? 0,
                },
              };
            } catch (error) {
              console.error("지갑 자산 계산 오류:", wallet.address, error);

              return {
                walletId: wallet.id,
                value: {
                  solBalance: 0,
                  solPriceUsd: 0,
                  totalUsd: 0,
                },
              };
            }
          }),
        );

        const nextWalletValues: WalletValueMap = {};

        for (const item of results) {
          nextWalletValues[item.walletId] = item.value;
        }

        setWalletValues(nextWalletValues);
      } finally {
        setLoading(false);
      }
    };

    loadWalletValues();
  }, []);

  const totalSolBalance = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.solBalance,
      0,
    );
  }, [walletValues]);

  const solPriceUsd = useMemo(() => {
    const firstValue = Object.values(walletValues).find(
      (wallet) => wallet.solPriceUsd > 0,
    );
    return firstValue?.solPriceUsd ?? 0;
  }, [walletValues]);

  const totalUsd = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.totalUsd,
      0,
    );
  }, [walletValues]);

  const visibleWallets = showAllWallets ? wallets : wallets.slice(0, 3);
  const hasMoreThanThree = wallets.length > 3;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">내 대시보드</h1>
      <p className="text-gray-600 mb-8">
        등록한 지갑들의 수익 요약과 거래 현황을 확인할 수 있습니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">총 SOL 자산 (USD)</p>
          <p className={`text-2xl font-bold ${getAmountColorClass(totalUsd)}`}>
            {loading ? "계산 중..." : `$${totalUsd.toFixed(4)}`}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {totalSolBalance.toFixed(6)} SOL × ${solPriceUsd.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">판매 수익</p>
          <p className="text-2xl font-bold text-black">$0</p>
          <p className="text-xs text-gray-500 mt-2">추후 구현 예정</p>
        </div>

        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">거래 확인</p>
          <p className="text-2xl font-bold text-black">0건</p>
          <p className="text-xs text-gray-500 mt-2">추후 구현 예정</p>
        </div>
      </div>

      <div className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-gray-900">
              복잡한 DEX 거래, 세무사와 바로 연결하세요
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-6">
              스왑, 브릿지, 스테이킹처럼 정리가 어려운 거래도 코인 세무 경험이
              있는 세무사와 상담할 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
                DEX 거래 검토
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
                세금 신고 준비
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
                지갑별 리포트 기반 상담
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
              세무사 연결하기
            </button>
            <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">등록된 지갑 주소</h2>

        {wallets.length === 0 ? (
          <p className="text-gray-500">등록된 지갑이 없습니다.</p>
        ) : (
          <>
            <div className="space-y-3">
              {visibleWallets.map((wallet) => {
                const walletValue = walletValues[wallet.id];
                const walletTotalUsd = walletValue?.totalUsd ?? 0;

                return (
                  <div
                    key={wallet.id}
                    className="border rounded-lg p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-medium">{wallet.name}</p>
                        <span
                          className={`text-xl font-semibold ${getAmountColorClass(
                            walletTotalUsd,
                          )}`}
                        >
                          {loading && !walletValue
                            ? "계산 중..."
                            : `$${walletTotalUsd.toFixed(2)}`}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 break-all mt-1">
                        {wallet.address}
                      </p>
                    </div>

                    <button className="shrink-0 px-4 py-2 border rounded-lg hover:bg-gray-100">
                      거래 보기
                    </button>
                  </div>
                );
              })}
            </div>

            {hasMoreThanThree && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllWallets((prev) => !prev)}
                  className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
                >
                  <img
                    src={showAllWallets ? IconBtnUp : IconBtnDown}
                    alt={showAllWallets ? "지갑 목록 접기" : "지갑 목록 더보기"}
                    className="w-10 h-10 object-contain"
                  />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
