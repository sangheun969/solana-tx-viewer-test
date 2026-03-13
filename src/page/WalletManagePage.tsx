import { useEffect, useState } from "react";
import type { SavedWallet } from "../types/wallet";
import {
  addWallet,
  deleteWallet,
  getSavedWallets,
} from "../utils/walletStorage";

const WalletManagePage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setWallets(getSavedWallets());
  }, []);

  const handleSave = () => {
    setError("");

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedAddress) {
      setError("지갑 이름과 퍼블릭 주소를 모두 입력해주세요.");
      return;
    }

    const duplicated = wallets.some(
      (wallet) => wallet.address.toLowerCase() === trimmedAddress.toLowerCase(),
    );

    if (duplicated) {
      setError("이미 등록된 지갑 주소입니다.");
      return;
    }

    const newWallet: SavedWallet = {
      id: crypto.randomUUID(),
      name: trimmedName,
      address: trimmedAddress,
      createdAt: new Date().toISOString(),
    };

    addWallet(newWallet);
    setWallets(getSavedWallets());
    setName("");
    setAddress("");
  };

  const handleDelete = (id: string) => {
    deleteWallet(id);
    setWallets(getSavedWallets());
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">지갑 관리</h1>
      <p className="text-gray-600 mb-8">
        등록한 지갑 이름과 퍼블릭 주소를 관리할 수 있습니다.
      </p>

      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">지갑 등록</h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">지갑 이름</label>
            <input
              type="text"
              placeholder="예: 메인 솔라나 지갑"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              지갑 퍼블릭 주소
            </label>
            <input
              type="text"
              placeholder="예: 8xY...abc"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <button
              onClick={handleSave}
              className="px-5 py-3 bg-black text-white rounded-lg hover:opacity-90"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">등록된 지갑 목록</h2>

        {wallets.length === 0 ? (
          <p className="text-gray-500">아직 등록된 지갑이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{wallet.name}</p>
                  <p className="text-sm text-gray-600 break-all">
                    {wallet.address}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManagePage;
