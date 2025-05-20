import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Create context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      } else {
        // Add new item with quantity 1
        const newItem = { ...action.payload, quantity: 1 };
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem && existingItem.quantity === 1) {
        // Remove item completely if quantity is 1
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - existingItem.price
        };
      } else if (existingItem) {
        // Decrease quantity if more than 1
        return {
          ...state,
          items: state.items.map(item => 
            item.id === action.payload.id 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          ),
          totalItems: state.totalItems - 1,
          totalPrice: state.totalPrice - existingItem.price
        };
      }
      return state;
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (!item) return state;
      
      const quantityDifference = quantity - item.quantity;
      const priceDifference = item.price * quantityDifference;
      
      return {
        ...state,
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity } : item
        ),
        totalItems: state.totalItems + quantityDifference,
        totalPrice: state.totalPrice + priceDifference
      };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);
  
  // Add item to cart
  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };
  
  // Remove item from cart
  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };
  
  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};