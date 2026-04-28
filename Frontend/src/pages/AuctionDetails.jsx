import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function AuctionDetails({ auctions, setAuctions }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const auction = auctions.find((a) => a.id === Number(id));

  const [newBid, setNewBid] = useState("");
  const [lastHighestUser, setLastHighestUser] = useState(null);
  const [showOutbid, setShowOutbid] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const botRef = useRef(null);

  // Timer
  useEffect(() => {
    if (!auction) return;
    setTimeLeft(Math.max(0, auction.endTime - Date.now()));
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, auction.endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.endTime]);

  // Outbid detection
  useEffect(() => {
    if (!auction?.bids?.length) return;
    const sorted = [...auction.bids].sort((a, b) => b.amount - a.amount);
    const currentTop = sorted[0].user;
    if (lastHighestUser === "You" && currentTop !== "You") {
      setShowOutbid(true);
      setTimeout(() => setShowOutbid(false), 3000);
    }
    setLastHighestUser(currentTop);
  }, [auction?.bids?.length]);

  // Bot bidding
  const startBot = () => {
    if (botRef.current) clearInterval(botRef.current);
    botRef.current = setInterval(() => {
      setAuctions((prev) =>
        prev.map((a) => {
          if (a.id !== Number(id) || Date.now() >= a.endTime) return a;
          const highest = Math.max(...a.bids.map((b) => b.amount));
          const inc = Math.floor(Math.random() * 2000) + 500;
          return {
            ...a,
            participants: a.participants + 1,
            bids: [
              ...a.bids,
              { user: "Bot_" + Math.floor(Math.random() * 100), amount: highest + inc },
            ],
          };
        })
      );
    }, 5000);
  };

  useEffect(() => {
    if (!auction || timeLeft <= 0) return;
    startBot();
    return () => clearInterval(botRef.current);
  }, [id]);

  // Highlight newest bid
  useEffect(() => {
    if (!auction?.bids?.length) return;
    setHighlightIndex(auction.bids.length - 1);
    const t = setTimeout(() => setHighlightIndex(null), 800);
    return () => clearTimeout(t);
  }, [auction?.bids?.length]);

  if (!auction) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Auction not found.</p>
        <button onClick={() => navigate("/")} className="text-blue-600 underline">
          Go back
        </button>
      </div>
    );
  }

  const highestBid =
    auction.bids.length > 0 ? Math.max(...auction.bids.map((b) => b.amount)) : 0;

  const sorted = [...auction.bids].sort((a, b) => b.amount - a.amount);
  const highestBidder = sorted[0]?.user;
  const isWinning = highestBidder === "You";
  const hasBid = auction.bids.some((b) => b.user === "You");
  const ended = timeLeft <= 0;

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleBid = () => {
    const bidValue = Number(newBid);
    if (!bidValue || bidValue <= highestBid) {
      alert(`Bid must be higher than ₹${highestBid.toLocaleString("en-IN")}`);
      return;
    }
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auction.id
          ? {
              ...a,
              participants: a.participants + 1,
              bids: [...a.bids, { user: "You", amount: bidValue }],
            }
          : a
      )
    );
    setNewBid("");
    startBot(); // resets the 5s bot timer after every bid
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Outbid toast */}
      {showOutbid && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 font-semibold animate-bounce">
          ⚠️ You got outbid!
        </div>
      )}

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-sm text-gray-300 hover:text-white flex items-center gap-1"
      >
        ← Back to auctions
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Image */}
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">{auction.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{auction.description}</p>

          {/* Price + Timer */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Current Bid</p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{highestBid.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-400 mt-1">{auction.participants} participants</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Time Left</p>
              <p
                className={`text-3xl font-bold font-mono ${
                  ended ? "text-gray-400" : timeLeft < 15000 ? "text-red-500 animate-pulse" : "text-gray-800"
                }`}
              >
                {ended ? "Ended" : formatTime(timeLeft)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4">
            {ended ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-yellow-800 font-semibold">
                🏁 Winner: {highestBidder}
              </div>
            ) : isWinning ? (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 font-semibold">
                🏆 You are winning!
              </div>
            ) : hasBid ? (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 font-semibold">
                ⚠️ You've been outbid
              </div>
            ) : null}
          </div>

          {/* Bid input */}
          {!ended && (
            <div className="mt-4 flex gap-2">
              <input
                type="number"
                value={newBid}
                onChange={(e) => setNewBid(e.target.value)}
                placeholder={`Min ₹${(highestBid + 1).toLocaleString("en-IN")}`}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleBid}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl transition-colors"
              >
                Bid
              </button>
            </div>
          )}

          {/* Top 5 */}
          <div className="mt-6">
            <h2 className="font-bold text-gray-700 mb-3">Top 5 Bidders</h2>
            <ul className="space-y-2">
              {sorted.slice(0, 5).map((b, i) => (
                <li
                  key={i}
                  className={`flex justify-between items-center px-3 py-2 rounded-lg ${
                    i === 0 ? "bg-green-50 font-semibold" : "bg-gray-50"
                  }`}
                >
                  <span className={b.user === "You" ? "text-blue-600 font-bold" : ""}>
                    {i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : `${i + 1}. `}
                    {b.user}
                  </span>
                  <span className="font-mono text-sm">₹{b.amount.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bid History */}
          <div className="mt-6">
            <h2 className="font-bold text-gray-700 mb-3">Bid History</h2>
            <ul className="space-y-1 max-h-48 overflow-y-auto">
              {[...auction.bids].reverse().map((b, i) => {
                const realIdx = auction.bids.length - 1 - i;
                return (
                  <li
                    key={i}
                    className={`flex justify-between text-sm px-2 py-1 rounded transition-colors ${
                      realIdx === highlightIndex ? "bg-yellow-100" : ""
                    }`}
                  >
                    <span className={b.user === "You" ? "text-blue-600 font-semibold" : "text-gray-600"}>
                      {b.user}
                    </span>
                    <span className="font-mono text-gray-700">
                      ₹{b.amount.toLocaleString("en-IN")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionDetails;