function ItemModal({ selectedItem, setSelectedItem }) {
  if (!selectedItem) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={() => setSelectedItem(null)}
    >
      <div
        className="bg-white w-175 max-h-[90vh] overflow-y-auto rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold">{selectedItem.name}</h2>

          <button
            onClick={() => setSelectedItem(null)}
            className="text-xl font-bold"
          >
            ✖
          </button>
        </div>

        {selectedItem.image && (
          <img
            src={selectedItem.image}
            alt=""
            className="w-full h-64 object-cover rounded-xl mb-5"
          />
        )}

        <div className="space-y-3 text-lg">
          <p><b>ID:</b> {selectedItem.id}</p>
          <p><b>Company:</b> {selectedItem.company}</p>
          <p><b>Age:</b> {selectedItem.age}</p>
          <p><b>Starting Price:</b> ₹{selectedItem.price}</p>
          <p><b>Condition:</b> {selectedItem.condition}</p>
          <p><b>Description:</b> {selectedItem.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;