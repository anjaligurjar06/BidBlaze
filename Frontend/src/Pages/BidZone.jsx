import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { auctions as initialData } from "../data/mockData";
import Home from "../Pages/Home";
import AuctionDetails from "../Pages/AuctionDetails";
import bg from "../assets/bg.jpeg";

function BidZone() {
  const [auctions, setAuctions] = useState(initialData);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen bg-black/60">
        
        {/* HEADER */}
        <div className="bg-white/10 backdrop-blur border-b border-white/20 px-6 py-4">
          <h1 className="text-2xl font-bold text-white tracking-tight text-center">
            Bid Zone
          </h1>
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