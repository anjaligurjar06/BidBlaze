import { useNavigate } from "react-router-dom";
import AuctionCard from "../components/AuctionCard";

function Home({ auctions }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-2xl font-bold text-white mb-6"
      >
        Live Auctions
      </h2>
      {auctions.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No auctions available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {auctions.map((a) => (
            <AuctionCard
              key={a.id}
              auction={a}
              onClick={() => navigate(`/auction/${a.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;