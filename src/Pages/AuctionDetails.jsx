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

  // TIMER
  useEffect(() => {
    if (!auction) return;
    setTimeLeft(Math.max(0, auction.endTime - Date.now()));
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, auction.endTime - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.endTime]);

  // OUTBID DETECTION
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

  // BOT
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
              {
                user: "Bot_" + Math.floor(Math.random() * 100),
                amount: highest + inc,
              },
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

  // HIGHLIGHT NEW BID
  useEffect(() => {
    if (!auction?.bids?.length) return;
    setHighlightIndex(auction.bids.length - 1);
    const t = setTimeout(() => setHighlightIndex(null), 800);
    return () => clearTimeout(t);
  }, [auction?.bids?.length]);

  if (!auction) {
    return (
      <div className="text-center py-20 text-white">
        Auction not found.
      </div>
    );
  }

  const highestBid =
    auction.bids.length > 0
      ? Math.max(...auction.bids.map((b) => b.amount))
      : 0;

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
    startBot();
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex justify-center items-center px-4">

      <div className="w-full max-w-2xl mt-6">

        {/* OUTBID ALERT */}
        {showOutbid && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-50 font-semibold animate-bounce">
            ⚠️ You got outbid!
          </div>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm text-gray-300 hover:text-white"
        >
          ← Back to auctions
        </button>

        {/* CARD */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-600">

          {/* IMAGE */}
          <img
            src={auction.image}
            alt={auction.title}
            className="w-full h-64 object-cover"
          />

          <div className="p-6 md:p-8">

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {auction.title}
            </h1>
            <p className="text-slate-300 mt-2">{auction.description}</p>

            {/* PRICE + TIMER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 p-5 bg-slate-700/40 rounded-xl">

              <div>
                <p className="text-xs text-slate-400 uppercase">
                  Current Bid
                </p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  ₹{highestBid.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {auction.participants} participants
                </p>
              </div>

              <div className="md:text-right">
                <p className="text-xs text-slate-400 uppercase">
                  Time Left
                </p>
                <p
                  className={`text-3xl font-mono mt-1 ${
                    ended
                      ? "text-slate-500"
                      : timeLeft < 15000
                      ? "text-red-400 animate-pulse"
                      : "text-white"
                  }`}
                >
                  {ended ? "Ended" : formatTime(timeLeft)}
                </p>
              </div>

            </div>

            {/* STATUS */}
            <div className="mt-6">
              {ended ? (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-3 text-yellow-300">
                  🏁 Winner: {highestBidder}
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

            {/* BID INPUT */}
            {!ended && (
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

            {/* TOP BIDDERS */}
            <div className="mt-8">
              <h2 className="text-white font-bold text-lg mb-3">
                Top Bidders
              </h2>
              <ul className="space-y-2">
                {sorted.slice(0, 5).map((b, i) => (
                  <li
                    key={i}
                    className={`flex justify-between px-4 py-3 rounded-lg ${
                      i === 0
                        ? "bg-green-500/20 border border-green-500/50"
                        : "bg-slate-700/30 border border-slate-600"
                    }`}
                  >
                    <span>{b.user}</span>
                    <span>₹{b.amount.toLocaleString("en-IN")}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AuctionDetails;