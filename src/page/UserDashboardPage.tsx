import { useEffect, useState } from "react";
import { getSavedWallets } from "../utils/walletStorage";
import type { SavedWallet } from "../types/wallet";
import { calculateWalletValue } from "../api/walletValue";

const UserDashboardPage = () => {
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [totalAssetKrw, setTotalAssetKrw] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedWallets = getSavedWallets();
    setWallets(savedWallets);

    const loadWalletValues = async () => {
      if (savedWallets.length === 0) {
        setTotalAssetKrw(0);
        return;
      }

      try {
        setLoading(true);

        let totalKrw = 0;

        for (const wallet of savedWallets) {
          const result = await calculateWalletValue(wallet.address);
          totalKrw += result.totalKrw;
        }

        setTotalAssetKrw(totalKrw);
      } catch (error) {
        console.error("지갑 총 자산 계산 오류:", error);
        setTotalAssetKrw(0);
      } finally {
        setLoading(false);
      }
    };

    loadWalletValues();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">내 대시보드</h1>
      <p className="text-gray-600 mb-8">
        등록한 지갑들의 수익 요약과 거래 현황을 확인할 수 있습니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500 mb-2">총 보유 자산</p>
          <p className="text-2xl font-bold">
            {loading
              ? "계산 중..."
              : `₩${Math.round(totalAssetKrw).toLocaleString()}`}
          </p>
        </div>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500 mb-2">판매 수익</p>
          <p className="text-2xl font-bold">₩0</p>
        </div>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <p className="text-sm text-gray-500 mb-2">거래 확인</p>
          <p className="text-2xl font-bold">0건</p>
        </div>
      </div>

      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">등록된 지갑 주소</h2>

        {wallets.length === 0 ? (
          <p className="text-gray-500">등록된 지갑이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-gray-600 break-all">
                    {wallet.address}
                  </p>
                </div>

                <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
                  거래 보기
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
