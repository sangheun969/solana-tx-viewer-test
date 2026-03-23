import { useEffect, useMemo, useState } from "react";
import { getSavedWallets } from "../utils/walletStorage";
import type { SavedWallet } from "../types/wallet";
import { calculateWalletValue } from "../api/walletValue";
import IconBtnDown from "../assets/icons/icon_btn_down.png";
import IconBtnUp from "../assets/icons/icon_btn_up.png";
import TaxAdvisorBanner from "../components/templates/TaxAdvisorBanner";
import TaxActionButtons from "../components/templates/TaxActionButtons";
import { fetchUsdKrwRate } from "../api/exchangeRate";
import EstimatedTaxModal from "../components/templates/EstimatedTaxModal";
import { fetchSolPriceUsd } from "../api/price";
import TaxAdvisorPromo from "../components/templates/TaxAdvisorPromo";

type WalletValueMap = Record<
  string,
  {
    solBalance: number;
    solPriceUsd: number;
    totalUsd: number;
    totalKrw: number;
    realizedPnl: number;
    realizedPnlKrw: number;
    txCount: number;
  }
>;

const getAmountColorClass = (amount: number) => {
  if (amount > 0) return "text-green-500";
  if (amount < 0) return "text-red-500";
  return "text-black";
};

const formatUsd = (amount: number) => {
  const sign = amount > 0 ? "+" : "";
  return `${sign}$${amount.toFixed(2)}`;
};

const formatKrw = (amount: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);

const UserDashboardPage = () => {
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [walletValues, setWalletValues] = useState<WalletValueMap>({});
  const [loading, setLoading] = useState(false);
  const [showAllWallets, setShowAllWallets] = useState(false);
  const [usdKrwRate, setUsdKrwRate] = useState(0);
  const [isEstimatedTaxModalOpen, setIsEstimatedTaxModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const savedWallets = getSavedWallets();
      setWallets(savedWallets);

      if (savedWallets.length === 0) {
        setWalletValues({});
        setLoading(false);
        return;
      }

      try {
        const rate = await fetchUsdKrwRate();
        setUsdKrwRate(rate);
        const solPriceUsd = await fetchSolPriceUsd();

        const results = await Promise.all(
          savedWallets.map(async (wallet) => {
            const result = await calculateWalletValue(
              wallet.address,
              solPriceUsd,
            );

            return {
              walletId: wallet.id,
              value: {
                ...result,
                totalUsd: result.totalUsd ?? 0,
              },
            };
          }),
        );

        const next: WalletValueMap = {};
        results.forEach((r) => {
          const totalUsd = r.value.totalUsd ?? 0;
          const realizedPnl = 0;

          next[r.walletId] = {
            solBalance: r.value.solBalance ?? 0,
            solPriceUsd: r.value.solPriceUsd ?? 0,
            totalUsd,
            totalKrw: totalUsd * rate,
            realizedPnl,
            realizedPnlKrw: realizedPnl * rate,
            txCount: 0,
          };
        });

        setWalletValues(next);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const totalSolBalance = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.solBalance,
      0,
    );
  }, [walletValues]);

  const totalUsd = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.totalUsd,
      0,
    );
  }, [walletValues]);

  const totalRealizedPnl = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.realizedPnl,
      0,
    );
  }, [walletValues]);

  const totalTxCount = useMemo(() => {
    return Object.values(walletValues).reduce(
      (sum, wallet) => sum + wallet.txCount,
      0,
    );
  }, [walletValues]);

  const visibleWallets = showAllWallets ? wallets : wallets.slice(0, 3);
  const hasMoreThanThree = wallets.length > 3;

  console.log("usdKrwRate:", usdKrwRate);
  console.log("totalUsd:", totalUsd);
  console.log("walletValues:", walletValues);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* <h1 className="text-2xl font-bold mb-2">내 대시보드</h1>
      <p className="text-gray-600 mb-8">
        등록한 지갑들의 자산 요약과 거래 현황을 확인할 수 있습니다.
      </p> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">총 SOL 자산 </p>
          <p className={`text-2xl font-bold ${getAmountColorClass(totalUsd)}`}>
            {loading ? "계산 중..." : formatKrw(totalUsd * usdKrwRate)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {totalSolBalance.toFixed(6)} SOL · 환율 {usdKrwRate.toFixed(2)}
            원/USD
          </p>
        </div>

        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">실현 손익</p>
          <p
            className={`text-2xl font-bold ${getAmountColorClass(
              totalRealizedPnl,
            )}`}
          >
            {loading ? "계산 중..." : formatUsd(totalRealizedPnl)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            현재는 0으로 표시되며 추후 거래 분석 기능으로 연결됩니다.
          </p>
        </div>

        <div className="rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm font-bold mb-2">거래 확인</p>
          <p className="text-2xl font-bold text-black">
            {loading ? "계산 중..." : `${totalTxCount}건`}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            현재는 0건으로 표시되며 추후 거래 내역 기능으로 연결됩니다.
          </p>
        </div>
      </div>
      <TaxAdvisorBanner />
      <TaxAdvisorPromo />
      <div className="mt-8">
        <TaxActionButtons
          onOpenEstimatedTax={() => setIsEstimatedTaxModalOpen(true)}
        />
      </div>
      <EstimatedTaxModal
        open={isEstimatedTaxModalOpen}
        onClose={() => setIsEstimatedTaxModalOpen(false)}
        realizedProfitKrw={totalRealizedPnl * usdKrwRate}
      />
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">등록된 지갑 주소.</h2>

        {wallets.length === 0 ? (
          <p className="text-gray-500">등록된 지갑이 없습니다.</p>
        ) : (
          <>
            <div className="space-y-3">
              {visibleWallets.map((wallet) => {
                const walletValue = walletValues[wallet.id];
                const walletTotalUsd = walletValue?.totalUsd ?? 0;
                const walletRealizedPnl = walletValue?.realizedPnl ?? 0;

                return (
                  <div
                    key={wallet.id}
                    className="border rounded-lg p-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-medium">{wallet.name}</p>

                        <span
                          className={`text-xl font-semibold ${getAmountColorClass(walletTotalUsd)}`}
                        >
                          {loading && !walletValue
                            ? "계산 중..."
                            : formatKrw(walletTotalUsd * usdKrwRate)}
                        </span>

                        <span className="text-gray-300">/</span>

                        <span
                          className={`text-lg font-semibold ${getAmountColorClass(
                            walletRealizedPnl,
                          )}`}
                        >
                          {loading && !walletValue
                            ? "..."
                            : formatUsd(walletRealizedPnl)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 break-all mt-1">
                        {wallet.address}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        총 자산 / 실현 손익
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
