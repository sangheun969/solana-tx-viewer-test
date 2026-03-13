import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../organisms/LoginModal";
import UserMenu from "../organisms/UserMenu";

type HeaderProps = {
  authed: boolean;
  onAuthChange: () => void;
};

const Header = ({ authed, onAuthChange }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b">
      <Link to="/" className="font-bold text-xl">
        Dex Tax Viewer
      </Link>

      <div className="flex items-center gap-3">
        {authed ? (
          <UserMenu onLogout={onAuthChange} />
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
        onLoginSuccess={onAuthChange}
      />
    </header>
  );
};

export default Header;
