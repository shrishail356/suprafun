import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import TokenDisplay from "./pages/TokenDisplay";
import SwapTransactionsViewer from "./pages/TransactionPage";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <button onClick={() => navigate("/token")} className="btn">
        Go to Token Explorer
      </button>
      <button onClick={() => navigate("/transaction")} className="btn">
        Go to Transaction Explorer
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/token" element={<TokenDisplay />} />
        <Route path="/transaction" element={<SwapTransactionsViewer />} />
      </Routes>
    </Router>
  );
}
