import { useEffect, useState } from "react";

function AuctionCard({ item, setSelectedItem }) {
  const [, forceUpdate] = useState(0);

  // 🔁 re-render every second (for live countdown)
  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((p) => p + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }

  // ✅ HANDLE BOTH TYPES
  let timeLeft;

  if (item.endTime) {
    // 🟢 NEW ITEMS → dynamic countdown
    timeLeft = Math.max(
      0,
      Math.floor((item.endTime - Date.now()) / 1000)
    );
  } else {
    // ⚪ OLD ITEMS → keep constant
    timeLeft = item.timeLeft || 0;
  }

  return (
    <div
      onClick={() => setSelectedItem(item)}
      className="group grid grid-cols-4 items-center rounded-2xl px-8 py-6 
      bg-[rgba(30,41,59,0.6)] backdrop-blur-lg 
      border border-slate-700 
      shadow-[0_10px_30px_rgba(0,0,0,0.4)]
      cursor-pointer 
      transition-all duration-300 ease-out
      hover:scale-[1.015] hover:border-slate-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
    >
      <span>{item.id}</span>

      <span className="font-semibold group-hover:text-white transition">
        {item.name}
      </span>

      <span>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold transition ${
            item.status === "Active"
              ? "bg-green-500/20 text-green-400 group-hover:bg-green-500/30"
              : "bg-slate-600/40 text-slate-300 group-hover:bg-slate-500/40"
          }`}
        >
          {item.status}
        </span>
      </span>

      <span
        className={`font-bold text-lg transition ${
          item.status === "Active"
            ? "text-red-400 group-hover:text-red-300"
            : "text-slate-500"
        }`}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

export default AuctionCard;