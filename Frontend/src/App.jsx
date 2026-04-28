import { useState, useEffect } from "react";
import AddAuction from "./components/AddAuction";
import ItemModal from "./components/ItemModal";
import AuctionCard from "./components/AuctionCard";

function App() {
  const [items, setItems] = useState([
    {
      id: 101,
      name: "Gaming Laptop",
      status: "Active",
      timeLeft: 28800,
      company: "Asus",
      age: "1 year",
      price: "45000",
      condition: "Good condition",
      description: "High performance gaming laptop.",
      image: "",
    },
    {
      id: 102,
      name: "Gaming Chair",
      status: "Completed",
      timeLeft: 28800,
      company: "DX Racer",
      age: "1 year",
      price: "12000",
      condition: "Comfortable with slight armrest wear.",
      description: "Premium ergonomic gaming chair.",
      image: "",
    },
    {
      id: 103,
      name: "Gaming Monitor",
      status: "Active",
      timeLeft: 28800,
      company: "LG",
      age: "10 months",
      price: "18000",
      condition: "Excellent condition.",
      description: "144Hz IPS gaming monitor.",
      image: "",
    },
    {
      id: 104,
      name: "iPhone 13 Pro",
      status: "Completed",
      timeLeft: 28800,
      company: "Apple",
      age: "8 months",
      price: "55000",
      condition: "Excellent condition.",
      description: "Latest iPhone with premium camera.",
      image: "",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.status === "Active" && item.timeLeft > 0) {
            const updatedTime = item.timeLeft - 1;

            return {
              ...item,
              timeLeft: updatedTime,
              status: updatedTime === 0 ? "Completed" : "Active",
            };
          }

          return item;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-4 bg-blue-100 text-blue-900 font-semibold text-lg rounded-2xl px-8 py-5 mb-5 shadow-sm">
          <span>ID</span>
          <span>Name</span>
          <span>Status</span>
          <span>Timer</span>
        </div>

        <AddAuction items={items} setItems={setItems} />

        <div className="space-y-5">
          {items.map((item) => (
            <AuctionCard
              key={item.id}
              item={item}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </div>

        <ItemModal
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />

      </div>
    </div>
  );
}

export default App;