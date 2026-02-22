import { Routes, Route } from "react-router-dom";
import SignupPage from "./components/organisms/SignupPage";
import Header from "./components/templates/Header";
import AddressSearchPage from "./page/AddressSearchPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<AddressSearchPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
