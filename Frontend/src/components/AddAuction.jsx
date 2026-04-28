import { useState } from "react";

function AddAuction({ setItems, items }) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
    company: "",
    age: "",
    condition: "",
    description: "",
  });

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

      const newItem = {
      id: items.length + 101,
      name: formData.name,
      status: "Active",
      timeLeft: 28800,
      image: formData.image,
      company: formData.company,
      age: formData.age,
      price: formData.price,
      condition: formData.condition,
      description: formData.description,
    };

    setItems([...items, newItem]);

    setFormData({
      name: "",
      image: "",
      price: "",
      company: "",
      age: "",
      condition: "",
      description: "",
    });

    setShowForm(false);
  }

  return (
    <>
      <div className="mb-5">
        <button
          onClick={() => setShowForm(!showForm)}
          className="group relative w-full rounded-2xl bg-white py-4 text-xl font-bold text-slate-800 overflow-hidden border border-slate-200 transition-all duration-300 hover:scale-[1.01]"
        >
          <span className="absolute inset-0 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full"></span>

          <span className="relative z-10 group-hover:text-white">
            ➕ Add Item To Auction
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ${
          showForm ? "max-h-1000px mb-6" : "max-h-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm space-y-4"
        >
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="age"
            placeholder="How old is product?"
            value={formData.age}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Starting Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />
          <input
            type="time"
            name="timer"
            placeholder="Auction Timer"
            value={formData.timer}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            required
          />

          <textarea
            name="condition"
            placeholder="Condition / What's broken?"
            value={formData.condition}
            onChange={handleChange}
            rows="4"
            className="w-full border p-3 rounded-xl"
            required
          ></textarea>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full border p-3 rounded-xl"
            required
          ></textarea>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Submit Item
          </button>
        </form>
      </div>
    </>
  );
}

export default AddAuction;