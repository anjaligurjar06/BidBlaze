import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import AddAuction from "../components/AddAuction";
import ItemModal from "../components/ItemModal";
import AuctionCard from "../components/AuctionCard";

function AuctionPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    apiFetch("/auctions/my").then(setItems).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 
    bg-[linear-gradient(rgba(15,23,42,0.35),rgba(15,23,42,0.45)),url('/assets/image.png')] 
    bg-cover bg-center bg-fixed text-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 
        bg-[rgba(30,41,59,0.6)] backdrop-blur-lg 
        text-slate-200 font-semibold text-lg 
        rounded-2xl px-8 py-5 mb-5 
        shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <span>ID</span>
          <span>Name</span>
          <span>Status</span>
          <span>Timer</span>
        </div>

        <AddAuction items={items} setItems={setItems} />

        <div className="space-y-5">
          {items.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No auctions listed yet. Add one above!
            </div>
          ) : (
            items.map((item) => (
              <AuctionCard
                key={item.id}
                item={item}
                setSelectedItem={setSelectedItem}
              />
            ))
          )}
        </div>

        <ItemModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </div>
    </div>
  );
}

export default AuctionPage;