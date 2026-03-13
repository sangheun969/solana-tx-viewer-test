import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SignupPage from "./components/organisms/SignupPage";
import Header from "./components/templates/Header";
import AddressSearchPage from "./page/AddressSearchPage";
import WalletManagePage from "./page/WalletManagePage";
import UserDashboardPage from "./page/UserDashboardPage";
import { isLoggedIn } from "./utils/auth";

function App() {
  const [authed, setAuthed] = useState(isLoggedIn());

  const syncAuth = () => {
    setAuthed(isLoggedIn());
  };

  useEffect(() => {
    syncAuth();

    const onStorage = () => syncAuth();
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthChange={syncAuth} authed={authed} />

      <Routes>
        <Route
          path="/"
          element={authed ? <UserDashboardPage /> : <AddressSearchPage />}
        />

        <Route
          path="/manage-wallets"
          element={authed ? <WalletManagePage /> : <Navigate to="/" replace />}
        />

        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
