import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Funktion för att hämta initiala varukorgsdata från localStorage
  const getInitialCart = () => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cartItems from localStorage", error);
      return []; 
    }
  };

  const [cartItems, setCartItems] = useState(getInitialCart());

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error stringifying cartItems for localStorage", error);
    }
   
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product._id 
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, id: product._id, quantity: 1 }];
    });
  };

  const removeFromCart = (itemToRemove) => {
    // Antaar att detta tar hela objektet
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map(
            (item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(0, newQuantity) }
                : item // Förhindra negativ kvantitet
          )
          .filter((item) => item.quantity > 0) // Ta bort objekt om kvantiteten blir 0
    );
  };

 
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
