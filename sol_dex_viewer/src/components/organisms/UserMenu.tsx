import { useState } from "react";
import { logout } from "../../utils/auth";
import { UserIcon } from "../../assets/icons";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ onLogout }: { onLogout: () => void }) => {
  const [open, setOpen] = useState(false);

  const userId = "user1";
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        <img src={UserIcon} className="w-8 h-8 rounded-full" alt="user" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow">
          <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
            {userId}
          </div>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              navigate("/manage-wallets");
            }}
          >
            관리
          </button>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              console.log("logout click");
              setOpen(false);
              logout();
              onLogout();
              navigate("/");
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
