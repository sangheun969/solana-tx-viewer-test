import type { SavedWallet } from "../types/wallet";

const STORAGE_KEY = "saved_wallets";

export const getSavedWallets = (): SavedWallet[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SavedWallet[];
  } catch {
    return [];
  }
};

export const saveWallets = (wallets: SavedWallet[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
};

export const addWallet = (wallet: SavedWallet) => {
  const current = getSavedWallets();
  saveWallets([wallet, ...current]);
};

export const deleteWallet = (id: string) => {
  const current = getSavedWallets();
  const filtered = current.filter((wallet) => wallet.id !== id);
  saveWallets(filtered);
};
