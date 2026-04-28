import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const Bidder = () => <h1>Bidder Page</h1>;
const ListItem = () => <h1>List Item Page</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/bidder" element={<Bidder />} />
        <Route path="/list-item" element={<ListItem />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
