import "./assets/css/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import axios from "axios";
import { useState } from "react";

axios.defaults.withCredentials = true;

function App() {
  const [token, setToken] = useState(null);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
