import { useEffect, useState } from "react";
import { loginDummy } from "../../utils/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setId("");
      setPw("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = loginDummy(id.trim(), pw);
    if (!ok) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다. (user1 / 1234)");
      return;
    }

    onClose();
    onLoginSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6 z-10 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-2">로그인</h2>
        <p className="text-sm text-gray-500 mb-6">테스트 계정: user1 / 1234</p>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          {error && <div className="text-sm text-red-600 -mt-1">{error}</div>}

          <button
            type="submit"
            className="mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
