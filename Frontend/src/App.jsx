import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { auctions as initialData } from "./data/mockData";
import Home from "./pages/Home";
import AuctionDetails from "./pages/AuctionDetails";
import bg from "./assets/bg.jpeg";

function App() {
  const [auctions, setAuctions] = useState(initialData);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-black/50">
        <div className="bg-white/10 backdrop-blur border-b border-white/20 px-6 py-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Bid Zone</h1>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home auctions={auctions} />} />
            <Route
              path="/auction/:id"
              element={<AuctionDetails auctions={auctions} setAuctions={setAuctions} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;