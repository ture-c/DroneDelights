import React, { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext"; 
import "./css/PopularItems.css";

const PopularItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); 

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5001/api/products");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const popularItems = data.slice(0, 3); // 3 varor
        setItems(popularItems);
      } catch (err) {
        console.error("Error fetching popular items:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    console.log("Added to cart:", item.name);
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
        <p className="section-subtitle">Our customers favorites.</p>

        <div className="items-grid">
          {items.map((item) => (
            <div className="item-card" key={item._id}>
              <div className="item-image-container">
                <img
                  src={item.imageUrl || "/placeholder.jpg"}
                  alt={item.name}
                  className="item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div className="item-content">
                <h3 className="item-name">{item.name}</h3>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                <div className="item-price-row">
                  <span className="item-price">
                    $
                    {typeof item.price === "number"
                      ? item.price.toFixed(2)
                      : "N/A"}
                  </span>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
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

//Om hinner ha en slideshow