import { useEffect, useState } from "react";
import type { SavedWallet } from "../types/wallet";
import { getSavedWallets, saveWallets } from "../utils/walletStorage";

const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const WalletManagePage = () => {
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadWallets = () => {
    const saved = getSavedWallets();
    setWallets(saved);
  };

  useEffect(() => {
    loadWallets();
  }, []);

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleAddWallet = () => {
    resetMessages();

    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || !trimmedAddress) {
      setError("지갑 이름과 주소를 모두 입력해주세요.");
      return;
    }

    if (!SOLANA_ADDRESS_REGEX.test(trimmedAddress)) {
      setError("올바른 Solana 지갑 주소 형식이 아닙니다.");
      return;
    }

    const duplicated = wallets.some(
      (wallet) => wallet.address.toLowerCase() === trimmedAddress.toLowerCase(),
    );

    if (duplicated) {
      setError("이미 등록된 지갑 주소입니다.");
      return;
    }

    try {
      const newWallet: SavedWallet = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: trimmedName,
        address: trimmedAddress,
        createdAt: new Date().toISOString(),
      };

      const updatedWallets = [...wallets, newWallet];

      saveWallets(updatedWallets);
      setWallets(updatedWallets);

      setName("");
      setAddress("");
      setSuccessMessage("지갑이 등록되었습니다.");
    } catch (err) {
      console.error("지갑 등록 오류:", err);
      setError("지갑 등록 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteWallet = (id: string) => {
    resetMessages();

    try {
      const updatedWallets = wallets.filter((wallet) => wallet.id !== id);

      saveWallets(updatedWallets);
      setWallets(updatedWallets);
      setSuccessMessage("지갑이 삭제되었습니다.");
    } catch (err) {
      console.error("지갑 삭제 오류:", err);
      setError("지갑 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">지갑 관리</h1>
        <p className="text-gray-600">
          대시보드에서 조회할 Solana 지갑 주소를 등록하고 관리할 수 있습니다.
        </p>
      </div>

      <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">지갑 등록</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">지갑 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 메인 지갑"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">지갑 주소</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Solana 지갑 주소를 입력하세요"
              rows={3}
              className="w-full border rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {successMessage ? (
          <p className="mt-4 text-sm text-green-600">{successMessage}</p>
        ) : null}

        <div className="mt-5">
          <button
            type="button"
            onClick={handleAddWallet}
            className="px-5 py-3 rounded-lg bg-black text-white hover:opacity-90"
          >
            지갑 등록
          </button>
        </div>
      </div>

      <div className="border rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">등록된 지갑 목록</h2>
          <span className="text-sm text-gray-500">
            {wallets.length}개 등록됨
          </span>
        </div>

        {wallets.length === 0 ? (
          <p className="text-gray-500">등록된 지갑이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="border rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium mb-1">{wallet.name}</p>
                  <p className="text-sm text-gray-600 break-all">
                    {wallet.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManagePage;
