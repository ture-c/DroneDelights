import React, { useState, useEffect } from 'react';
import './Menu.css'; 


const initialMenuItems = [
  {
    id: 1,
    name: "Drone Deluxe Burger",
    description: "A juicy beef patty with fresh lettuce, tomato, cheese, and our secret drone sauce, delivered hot.",
    price: 12.99,
    image: "/images/menu/burger_deluxe.jpg", // public/images/menu/
    category: "Burgers"
  },
  {
    id: 2,
    name: "Sky-High Fries",
    description: "Crispy golden fries, seasoned to perfection and airlifted to your location.",
    price: 4.50,
    image: "/images/menu/sky_high_fries.jpg",
    category: "Sides"
  },
  {
    id: 3,
    name: "Stealth Mode Pizza",
    description: "A 12-inch pizza with your choice of toppings, delivered silently and swiftly.",
    price: 15.75,
    image: "/images/menu/stealth_pizza.jpg",
    category: "Pizzas"
  },
  {
    id: 4,
    name: "Rotor Root Beer Float",
    description: "Classic root beer float with a creamy vanilla ice cream, a perfect landing for your meal.",
    price: 5.00,
    image: "/images/menu/rotor_root_beer.jpg",
    category: "Drinks"
  },
  {
    id: 5,
    name: "Aviator's Salad",
    description: "Fresh greens, cherry tomatoes, cucumbers, and grilled chicken with a light vinaigrette.",
    price: 10.25,
    image: "/images/menu/aviator_salad.jpg",
    category: "Salads"
  }
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Simulate fetching data

    setMenuItems(initialMenuItems);
    setLoading(false);
  }, []);

  const categories = ['All', ...new Set(initialMenuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div className="menu-loading">Loading menu...</div>;
  }

  if (error) {
    return <div className="menu-error">Error fetching menu: {error}</div>;
  }

  return (
    <div className="menu-page-container">
      <h1 className="menu-page-title">Our Delicious Offerings</h1>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-items-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="menu-item-card">
              <img src={item.image} alt={item.name} className="menu-item-image" />
              <div className="menu-item-details">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <p className="menu-item-price">${item.price.toFixed(2)}</p>
                <button className="add-to-cart-button">Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>No items found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;