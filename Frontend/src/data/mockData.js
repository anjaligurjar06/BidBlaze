export const auctions = [
  {
    id: 1,
    title: "Vintage Rolex Submariner",
    description: "1968 model, original dial, full service history",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    bids: [
      { user: "Rahul_K", amount: 280000 },
      { user: "Priya_S", amount: 295000 },
      { user: "Bot_44", amount: 312000 },
    ],
    participants: 23,
    endTime: Date.now() + 90000,
  },
  {
    id: 2,
    title: "Kashmir Blue Sapphire Ring",
    description: "12ct natural sapphire, Art Deco platinum setting",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    bids: [
      { user: "Anjali_M", amount: 540000 },
      { user: "Bot_12", amount: 562000 },
    ],
    participants: 15,
    endTime: Date.now() + 120000,
  },
  {
    id: 3,
    title: "M.F. Husain — Untitled 1977",
    description: "Oil on canvas, signed, certificate of authenticity",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    bids: [
      { user: "Collector_1", amount: 1200000 },
      { user: "Bot_7", amount: 1250000 },
      { user: "Arun_V", amount: 1285000 },
    ],
    participants: 41,
    endTime: Date.now() + 60000,
  },
  {
    id: 4,
    title: "1963 Triumph Bonneville",
    description: "Fully restored, matching numbers, show condition",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    bids: [
      { user: "Vikram_D", amount: 420000 },
      { user: "Bot_33", amount: 445000 },
    ],
    participants: 18,
    endTime: Date.now() + 150000,
  },
];