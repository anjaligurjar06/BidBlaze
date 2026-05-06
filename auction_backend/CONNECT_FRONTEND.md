# How to wire your React frontend to the FastAPI backend

## 1 — Install and run the backend

```bash
cd auction_backend
pip install -r requirements.txt
uvicorn main:app --reload
# API is now at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

---

## 2 — Create a shared API helper in your React project

Create `src/api.js`:

```js
const BASE = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}
```

---

## 3 — Update Login.jsx

Replace the localStorage logic with:

```js
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("uniqueId", data.unique_id);
    navigate("/dashboard");
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 4 — Update Signup.jsx

```js
const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });
    localStorage.setItem("token", data.access_token);
    setFormData({ ...formData, uniqueId: data.unique_id });
    alert(`Signup successful! Your ID: ${data.unique_id}`);
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 5 — Update Dashboard.jsx (load real bids + items)

```js
useEffect(() => {
  apiFetch("/bids/my/all").then(setBids);
  apiFetch("/items/my").then(setItems);
}, []);
```

---

## 6 — Update BidZone / Home.jsx (load real auctions)

```js
useEffect(() => {
  apiFetch("/auctions/").then(setAuctions);
}, []);
```

---

## 7 — Update AuctionDetails.jsx (place real bids)

```js
const handleBid = async () => {
  const bidValue = Number(newBid);
  try {
    await apiFetch(`/bids/${auction.id}`, {
      method: "POST",
      body: JSON.stringify({ amount: bidValue }),
    });
    // Refetch auction to get updated bids
    const updated = await apiFetch(`/auctions/${auction.id}`);
    setAuctions(prev => prev.map(a => a.id === updated.id ? updated : a));
    setNewBid("");
  } catch (err) {
    alert(err.message);
  }
};
```

---

## 8 — Update AddAuction.jsx (multipart form with image)

The form already uses a file input — send as FormData instead of JSON:

```js
async function handleSubmit(e) {
  e.preventDefault();
  const fd = new FormData();
  fd.append("title", formData.name);
  fd.append("start_price", formData.price);
  fd.append("duration_seconds", formData.duration);
  fd.append("company", formData.company);
  fd.append("age", formData.age);
  fd.append("condition", formData.condition);
  fd.append("description", formData.description);
  if (imageFile) fd.append("image", imageFile);  // keep raw File, not object URL

  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:8000/auctions/", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const newAuction = await res.json();
  setItems(prev => [...prev, newAuction]);
  setShowForm(false);
}
```

---

## Project structure

```
auction_backend/
├── main.py
├── database.py
├── models.py
├── schemas.py
├── auth.py
├── requirements.txt
└── routers/
    ├── __init__.py
    ├── auth_router.py
    ├── auctions_router.py
    ├── bids_router.py
    └── items_router.py
```
