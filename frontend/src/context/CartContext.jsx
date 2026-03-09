// src/context/CartContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) { setCart([]); return; }
      const res = await axios.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error(err);
      setCart([]);
    }
  };

  useEffect(() => { fetchCart(); }, [token]);

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", checkToken);
    const interval = setInterval(checkToken, 500);
    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  const addToCart = async (product, qty = 1) => {
    try {
      const token = getToken();
      await axios.post("/api/cart/add", 
        { productId: product._id, quantity: qty }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const removeFromCart = async (id) => {
    try {
      const token = getToken();
      await axios.post("/api/cart/remove", 
        { productId: id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const updateQuantity = async (id, qty) => {
    try {
      const token = getToken();
      await axios.put("/api/cart/update", 
        { productId: id, quantity: qty }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const clearCart = async () => {
    try {
      const token = getToken();
      await axios.post("/api/cart/clear", {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (err) { console.error(err); }
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        cartCount, 
        refreshCart: fetchCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}