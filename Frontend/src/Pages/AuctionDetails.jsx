import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../api";

function AuctionDetails({ auctions, setAuctions }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const auction = auctions.find((a) => a.id === Number(id));
  const [newBid, setNewBid] = useState("");
  const [lastHighestUserId, setLastHighestUserId] = useState(null);
  const [showOutbid, setShowOutbid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const myUserId = Number(localStorage.getItem("userId"));
  const myName = localStorage.getItem("name");

  // TIMER
  useEffect(() => {
    if (!auction) return;
    const end = new Date(auction.end_time).getTime();
    setTimeLeft(Math.max(0, end - Date.now()));
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, end - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.end_time]);

  // OUTBID DETECTION — uses user_id not name
  useEffect(() => {
    if (!auction?.bids?.length) return;
    const sorted = [...auction.bids].sort((a, b) => b.amount - a.amount);
    const currentTopId = sorted[0].user_id;
    if (lastHighestUserId === myUserId && currentTopId !== myUserId) {
      setShowOutbid(true);
      setTimeout(() => setShowOutbid(false), 3000);
    }
    setLastHighestUserId(currentTopId);
  }, [auction?.bids?.length]);

  // POLL for new bids every 5 seconds
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const updated = await apiFetch(`/auctions/${id}`);
        setAuctions((prev) => prev.map((a) => a.id === updated.id ? updated : a));
      } catch (e) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!auction) {
    return <div className="text-center py-20 text-white">Auction not found.</div>;
  }

  const highestBid =
    auction.bids.length > 0
      ? Math.max(...auction.bids.map((b) => b.amount))
      : auction.start_price;

  const sorted = [...auction.bids].sort((a, b) => b.amount - a.amount);
  const highestBidder = sorted[0]?.user;
  const isOwner = auction.owner_id === myUserId;
  const isWinning = sorted[0]?.user_id === myUserId;
  const hasBid = auction.bids.some((b) => b.user_id === myUserId);
  const ended = timeLeft <= 0;

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleBid = async () => {
    const bidValue = Number(newBid);
    if (!bidValue || bidValue <= highestBid) {
      alert(`Bid must be higher than ₹${highestBid.toLocaleString("en-IN")}`);
      return;
    }
    try {
      await apiFetch(`/bids/${auction.id}`, {
        method: "POST",
        body: JSON.stringify({ amount: bidValue }),
      });
      const updated = await apiFetch(`/auctions/${auction.id}`);
      setAuctions((prev) => prev.map((a) => a.id === updated.id ? updated : a));
      setNewBid("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center px-4">
      <div className="w-full max-w-2xl mt-6">

        {showOutbid && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 font-semibold animate-bounce">
            ⚠️ You got outbid!
          </div>
        )}

        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-300 hover:text-white">
          ← Back to auctions
        </button>

        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-600">

          {auction.image ? (
            <img src={auction.image} alt={auction.title} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-32 flex items-center justify-center bg-slate-700/40 text-5xl">🏷️</div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{auction.title}</h1>
            <p className="text-slate-300 mt-2">{auction.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 bg-slate-700/40 rounded-xl">
              <div>
                <p className="text-xs text-slate-400 uppercase">Current Bid</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  ₹{highestBid.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-slate-400 mt-1">{auction.participants} participants</p>
              </div>
              <div className="md:text-right">
                <p className="text-xs text-slate-400 uppercase">Time Left</p>
                <p className={`text-3xl font-mono mt-1 ${
                  ended ? "text-slate-500" : timeLeft < 15000 ? "text-red-400 animate-pulse" : "text-white"
                }`}>
                  {ended ? "Ended" : formatTime(timeLeft)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {ended ? (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-3 text-yellow-300">
                  🏁 Winner: {highestBidder || "No bids"}
                </div>
              ) : isOwner ? (
                <div className="bg-slate-700/40 rounded-xl px-4 py-3 text-slate-400 text-center">
                  🏷️ This is your auction — you cannot bid on it
                </div>
              ) : isWinning ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl px-4 py-3 text-green-300">
                  🏆 You are winning!
                </div>
              ) : hasBid ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-3 text-red-300">
                  ⚠️ You've been outbid
                </div>
              ) : null}
            </div>

            {!ended && !isOwner && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  value={newBid}
                  onChange={(e) => setNewBid(e.target.value)}
                  placeholder={`Min ₹${(highestBid + 1).toLocaleString("en-IN")}`}
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white"
                />
                <button
                  onClick={handleBid}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
                >
                  Place Bid
                </button>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-white font-bold text-lg mb-3">Top Bidders</h2>
              {sorted.length === 0 ? (
                <p className="text-slate-400 text-sm">No bids yet — be the first!</p>
              ) : (
                <ul className="space-y-2">
                  {sorted.slice(0, 5).map((b, i) => (
                    <li key={i} className={`flex justify-between px-4 py-3 rounded-lg ${
                      i === 0
                        ? "bg-green-500/20 border border-green-500/50"
                        : "bg-slate-700/30 border border-slate-600"
                    }`}>
                      <span>{b.user} {b.user_id === myUserId ? "(You)" : ""}</span>
                      <span>₹{b.amount.toLocaleString("en-IN")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;