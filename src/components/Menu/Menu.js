import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useCart } from '../../contexts/CartContext';

const Menu = () => {
  const [menuItemsToDisplay, setMenuItemsToDisplay] = useState([]); // Vad som faktiskt visas efter filtrering
  const [allFetchedMenuItems, setAllFetchedMenuItems] = useState([]); // Alla objekt hämtade från servern
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']); // Startar med 'All', resten läggs till dynamiskt
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setError(null);
      try {
        // Se till att din JSON-server körs, vanligtvis på port 3000
        // Endpointen ska matcha nyckeln i din db.json (t.ex. "menuItems")
        const response = await fetch('http://localhost:3001/menuItems'); // Anpassa port om nödvändigt
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setAllFetchedMenuItems(data); // Spara alla hämtade objekt
        setMenuItemsToDisplay(data);   // Initialt visa alla objekt

        // Generera kategorier dynamiskt från hämtad data
        // Använder Set för att få unika kategorier
        const uniqueCategories = ['All', ...new Set(data.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Fetch error:", err); // Logga felet för felsökning
        setError(err.message);
        setAllFetchedMenuItems([]); // Rensa vid fel
        setMenuItemsToDisplay([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []); // Tom dependency array betyder att detta körs en gång när komponenten mountas

  // useEffect för att filtrera när selectedCategory eller allFetchedMenuItems ändras
  useEffect(() => {
    if (selectedCategory === 'All') {
      setMenuItemsToDisplay(allFetchedMenuItems);
    } else {
      setMenuItemsToDisplay(allFetchedMenuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, allFetchedMenuItems]);


  if (loading) {
    return <div className="menu-loading">Loading menu...</div>;
  }

  if (error) {
    return <div className="menu-error">Error fetching menu: {error}. Please ensure your JSON server is running and the data is correct.</div>;
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
        {menuItemsToDisplay.length > 0 ? (
          menuItemsToDisplay.map(item => (
            <div key={item.id} className="menu-item-card">
              {/* Se till att bildsökvägarna i db.json är korrekta */}
              <img src={item.image} alt={item.name} className="menu-item-image" />
              <div className="menu-item-details">
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <p className="menu-item-price">${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}</p>
                <button 
                  className="add-to-cart-button"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items found {selectedCategory !== 'All' ? `in the "${selectedCategory}" category` : 'matching your criteria'}.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;