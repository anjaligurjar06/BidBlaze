import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import AuctionPage from "./Pages/AuctionPage";
import BidZone from "./Pages/BidZone";

const Bidder = () => <h1>Bidder Page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bidder" element={<Bidder />} />
        <Route path="/list-item" element={<AuctionPage />} />
        <Route path="/bid-zone/*" element={<BidZone />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;