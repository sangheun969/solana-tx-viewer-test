import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginModal from "../organisms/LoginModal";
import { isLoggedIn, logout } from "../../utils/auth";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  const syncAuth = () => setAuthed(isLoggedIn());

  useEffect(() => {
    syncAuth();
    const onStorage = () => syncAuth();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b">
      <Link to="/" className="font-bold text-xl">
        Dex Tax Viewer
      </Link>

      <div className="flex items-center gap-3">
        {authed ? (
          <>
            <span className="text-sm text-gray-600">user1</span>
            <button
              className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
              onClick={() => {
                logout();
                syncAuth();
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button
              className="px-3 py-1.5 rounded-md border hover:bg-gray-50"
              onClick={() => setOpen(true)}
            >
              로그인
            </button>

            <Link
              to="/signup"
              className="px-3 py-1.5 rounded-md bg-black text-white hover:bg-gray-800"
            >
              회원가입
            </Link>
          </>
        )}
      </div>

      <LoginModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onLoginSuccess={syncAuth}
      />
    </header>
  );
};

export default Header;
