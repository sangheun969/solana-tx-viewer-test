import { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../organisms/LoginModal";
import type React from "react";

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="w-full h-14 border-b bg-white flex items-center justify-between px-6">
        <Link to="/" className="text-lg font-semibold text-gray-900">
          Dex Tax Viewer
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoginOpen(true)}
            className="px-4 py-1.5 text-sm rounded-md border border-gray-300
                       text-gray-700 hover:bg-gray-100 transition"
          >
            로그인
          </button>

          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm rounded-md bg-black
                     text-white hover:bg-gray-800 transition"
          >
            회원가입
          </Link>
        </div>
      </header>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
