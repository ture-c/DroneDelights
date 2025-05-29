import React, { useState, useEffect } from "react";
import "./Menu.css";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext"; 


const Menu = () => {
  const [menuItemsToDisplay, setMenuItemsToDisplay] = useState([]);
  const [allFetchedMenuItems, setAllFetchedMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const { addToCart } = useCart();
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5001/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setAllFetchedMenuItems(data);
        setMenuItemsToDisplay(data);

        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setAllFetchedMenuItems([]);
        setMenuItemsToDisplay([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setMenuItemsToDisplay(allFetchedMenuItems);
    } else {
      setMenuItemsToDisplay(
        allFetchedMenuItems.filter((item) => item.category === selectedCategory)
      );
    }
  }, [selectedCategory, allFetchedMenuItems]);

  if (loading) return <div className="menu-loading">Loading menu...</div>;
  if (error)
    return <div className="menu-error">Error fetching menu: {error}.</div>;

  return (
    <div className="menu-page-container">
      <h1 className="menu-page-title">Our Delicious Offerings</h1>
      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="menu-items-grid">
        {menuItemsToDisplay.length > 0 ? (
          menuItemsToDisplay.map((item) => (
            <div key={item._id} className="menu-item-card">
              
              <img
                src={item.imageUrl || "/placeholder.jpg"}
                alt={item.name}
                className="menu-item-image"
              />
              <div className="menu-item-details">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>{" "}
             
                <p className="menu-item-price">
                  $
                  {typeof item.price === "number"
                    ? item.price.toFixed(2)
                    : "N/A"}
                </p>
              </div>
              <button
                className="add-to-cart-button"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>
            No items found{" "}
            {selectedCategory !== "All"
              ? `in the "${selectedCategory}" category`
              : "matching your criteria"}
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
