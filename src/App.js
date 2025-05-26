import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Layout/Header";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Menu from "./components/Menu/Menu";
import Cart from "./components/Cart/Cart";
import Payment from "./components/Checkout/Payment";
import Confirmation from "./components/Checkout/Confirmation";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Header />
          <div className="container">
            {" "}
            {/*  */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </div>
          {/**/}
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
