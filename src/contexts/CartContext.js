import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  let newState;
  switch (action.type) {
    case "ADD_ITEM": {
      const itemToAdd = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemToAdd.id
      );
      let updatedItems;

      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (itemToAdd.quantity || 1) }
            : item
        );
      } else {
        updatedItems = [
          ...state.items,
          { ...itemToAdd, quantity: itemToAdd.quantity || 1 },
        ];
      }

      const newTotalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      newState = {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
      console.log("CartContext: ADD_ITEM - New state:", newState);
      return newState;
    }

    case "REMOVE_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem && existingItem.quantity === 1) {
        // Ta bort item helt om quantity är 1
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - existingItem.price,
        };
      } else if (existingItem) {
        // Minska quantity by 1
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - existingItem.price,
        };
      }
      return state;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (!item) return state;

      const quantityDifference = quantity - item.quantity;
      const priceDifference = item.price * quantityDifference;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + priceDifference,
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  // Ta bort item från cart
  const removeFromCart = (item) => {
    dispatch({ type: "REMOVE_ITEM", payload: item });
  };

  // Updatera item i cart
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  // Rensa hela cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const contextValue = {
    cartItems: state.items,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  // Logga provider value för debugging
  console.log(
    "CartContext: Provider value being provided (state.totalItems):",
    state.totalItems,
    "Full contextValue:",
    contextValue
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
