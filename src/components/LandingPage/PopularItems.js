import React, { useState, useEffect } from 'react';
import './css/PopularItems.css';

const PopularItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('droneDelightsCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/menuItems');
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  useEffect(() => {
    localStorage.setItem('droneDelightsCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }
    
    setCart(updatedCart);
    
    alert(`${item.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <section className="popular-items-section">
        <div className="container">
          <h2 className="section-title">Popular Items</h2>
          <div className="loading">Loading popular items...</div>
        </div>
      </section>
    );
  }

  // Display error state
  if (error) {
    return (
      <section className="popular-items-section">
        <div className="container">
          <h2 className="section-title">Popular Items</h2>
          <div className="error">
            <p>Sorry, we couldn't load the menu items.</p>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // If no items were found
  if (items.length === 0) {
    return (
      <section className="popular-items-section">
        <div className="container">
          <h2 className="section-title">Popular Items</h2>
          <div className="no-items">
            <p>No popular items found. Check back later!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="popular-items-section">
      <div className="container">
        <h2 className="section-title">Popular Items</h2>
        <p className="section-subtitle">Our customers' favorites, delivered by drone in minutes</p>
        
        <div className="items-grid">
          {items.map(item => (
            <div className="item-card" key={item.id}>
              <div className="item-image-container">
                <img 
                  src={item.image.startsWith('./') ? item.image.substring(1) : item.image} 
                  alt={item.name} 
                  className="item-image" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-food.jpg';
                  }}
                />
              </div>
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                {item.description ? (
                  <p className="item-description">{item.description}</p>
                ) : item.ingredients ? (
                  <p className="item-description">
                    {item.ingredients.join(', ')}
                  </p>
                ) : null}
                <div className="item-price-row">
                  <span className="item-price">{item.price} kr</span>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularItems;