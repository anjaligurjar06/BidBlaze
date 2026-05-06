import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import Home from "../Pages/Home";
import AuctionDetails from "../Pages/AuctionDetails";
import bg from "../assets/bg.jpeg";

function BidZone() {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch("/auctions/").then(setAuctions);
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-black/60">

        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white text-sm hover:text-blue-300 transition"
          >
            ← Dashboard
          </button>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bid Zone
          </h1>

          <div className="w-20" /> {/* spacer to keep title centered */}
        </div>

        {/* CONTENT */}
        <div className="w-full max-w-7xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Home auctions={auctions} />} />
            <Route
              path="/auction/:id"
              element={
                <AuctionDetails
                  auctions={auctions}
                  setAuctions={setAuctions}
                />
              }
            />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default BidZone;