import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bids as initialBids, items as initialItems } from "../data/data";
import "../Styles/Dashboard.css";
import AuctionPage from "./AuctionPage";
const Dashboard = () => {
  const navigate = useNavigate();

  const [bids] = useState(initialBids);
  const [items] = useState(initialItems);

  return (
    <div className="container">
      
      {/* LEFT SIDE */}
      <div className="left">
        <h2>Hi Anish!! </h2>

        {/* BIDS */}
        <div className="card big">
          <h3>Your Bids</h3>
          {bids.map((bid) => (
            <div key={bid.id} className="listItem clickable">
              <div>{bid.item}</div>
              <div className="price">
                <small>Current Max Price</small>
                <span>₹{bid.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ITEMS */}
        <div className="card big">
          <h3>Your Items</h3>
          {items.map((item) => (
            <div key={item.id} className="listItem clickable">
              <span>{item.name}</span>
              <span className={item.status === "Sold" ? "sold" : "pending"}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right">
        <div className="bigButton top" onClick={() => navigate("/bid-zone")}>
          Become a Bidder
        </div>

        <div className="bigButton bottom" onClick={() => navigate("/list-item")}>
          List Items
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
