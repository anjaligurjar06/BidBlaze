import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";
import { apiFetch } from "../api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [bids, setBids] = useState([]);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") || "User");
    apiFetch("/bids/my/all").then(setBids).catch(console.error);
    apiFetch("/auctions/my").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="container">

      {/* LEFT SIDE */}
      <div className="left">
        <h2>Hi {name}!!</h2>

        {/* BIDS */}
        <div className="card big">
          <h3>Your Bids</h3>
          {bids.length === 0 ? (
            <p style={{ color: "#94a3b8", padding: "10px 0" }}>No bids yet</p>
          ) : (
            bids.map((bid) => (
              <div key={bid.id} className="listItem clickable">
                <div>{bid.item}</div>
                <div className="price">
                  <small>Current Max Price</small>
                  <span>₹{bid.price}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ITEMS */}
        <div className="card big">
          <h3>Your Listings</h3>
          {items.length === 0 ? (
            <p style={{ color: "#94a3b8", padding: "10px 0" }}>No listings yet</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="listItem clickable">
                <span>{item.title || item.name}</span>
                <span className={item.status === "Completed" ? "sold" : "pending"}>
                  {item.status}
                </span>
              </div>
            ))
          )}
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