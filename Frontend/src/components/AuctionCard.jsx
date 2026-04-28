function AuctionCard({ auction, onClick }) {
  const highestBid =
    auction?.bids?.length > 0
      ? Math.max(...auction.bids.map((b) => b.amount))
      : 0;

  const timeLeft = Math.max(0, auction.endTime - Date.now());
  const ended = timeLeft <= 0;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100 group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {ended && (
          <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
            Ended
          </div>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-bold text-gray-900 text-base truncate">{auction.title}</h2>
        <p className="text-gray-400 text-xs mt-1 truncate">{auction.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-xs text-gray-400">Current Bid</p>
            <p className="text-blue-600 font-bold text-lg">
              ₹{highestBid.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Participants</p>
            <p className="text-gray-700 font-semibold">{auction.participants}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionCard;