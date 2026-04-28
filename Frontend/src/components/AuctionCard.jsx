function AuctionCard({ item, setSelectedItem }) {
  function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }

  return (
    <div
      onClick={() => setSelectedItem(item)}
      className="grid grid-cols-4 items-center rounded-2xl bg-white px-8 py-6 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition"
    >
      <span>{item.id}</span>

      <span className="font-semibold">{item.name}</span>

      <span>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {item.status}
        </span>
      </span>

      <span
        className={`font-bold text-lg ${
          item.status === "Active"
            ? "text-red-500"
            : "text-slate-400"
        }`}
      >
        {formatTime(item.timeLeft || 0)}
      </span>
    </div>
  );
}

export default AuctionCard;