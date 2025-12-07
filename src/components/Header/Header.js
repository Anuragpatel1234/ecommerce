import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import './Header.css';

const Header = () => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, currency, cart, wishlist, setCurrency, logout } = useApp();

  const currencies = [
    { code: 'INR', flag: '🇮🇳', name: 'INDIAN RUPEE (INR)' },
    { code: 'USD', flag: '🇺🇸', name: 'US DOLLAR (USD)' },
    { code: 'EUR', flag: '🇪🇺', name: 'EURO (EUR)' },
    { code: 'GBP', flag: '🇬🇧', name: 'BRITISH POUND (GBP)' },
    { code: 'CAD', flag: '🇨🇦', name: 'CANADIAN DOLLAR (CAD)' },
    { code: 'AUD', flag: '🇦🇺', name: 'AUSTRALIAN DOLLAR (AUD)' },
    { code: 'SGD', flag: '🇸🇬', name: 'SINGAPORE DOLLAR (SGD)' }
  ];

  const toggleCurrencyDropdown = () => {
    setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const selectCurrency = (currencyCode) => {
    setCurrency(currencyCode);
    setIsCurrencyDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header id="navbar-section">
      <div className="top-header">
        <div className="header-left">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        <div className="header-center">
          <Link to="/" className="brand-logo">
            <img 
              src={process.env.PUBLIC_URL + "/img/RANGAARA-logo.png"} 
              alt="Rangaara" 
              className="logo-image"
              onError={(e) => {
                console.error('Failed to load logo image');
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>
        <div className="header-right">
          <div 
            className={`user-dropdown ${isUserDropdownOpen ? 'active' : ''}`}
            ref={userDropdownRef}
          >
            <i className="fa-regular fa-user" onClick={toggleUserDropdown}></i>
            <div className={`user-dropdown-menu ${isUserDropdownOpen ? 'show' : ''}`}>
              {user ? (
                <>
                  <div className="user-info">
                    <span>Hello, {user.firstName}</span>
                  </div>
                  <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setIsUserDropdownOpen(false)}>Orders</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsUserDropdownOpen(false)}>Login</Link>
                  <Link to="/register" onClick={() => setIsUserDropdownOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
          
          <Link to="/wishlist" className="header-icon">
            <i className="fa-regular fa-heart"></i>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          
          <div 
            className={`currency-dropdown ${isCurrencyDropdownOpen ? 'active' : ''}`}
            ref={dropdownRef}
          >
            <span className="currency-selector" onClick={toggleCurrencyDropdown}>
              {currency} <i className="fa-solid fa-chevron-down"></i>
            </span>
            <div className={`currency-dropdown-menu ${isCurrencyDropdownOpen ? 'show' : ''}`}>
              {currencies.map((curr) => (
                <div 
                  key={curr.code}
                  className="currency-option" 
                  onClick={() => selectCurrency(curr.code)}
                >
                  <span className="flag-icon">{curr.flag}</span>
                  <span className="currency-text">{curr.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Link to="/cart" className="header-icon">
            <i className="fa-solid fa-bag-shopping"></i>
            {cart.items.length > 0 && <span className="badge">{cart.items.length}</span>}
          </Link>
        </div>
      </div>
      <nav className="main-navigation">
        <Link to="/shop?filter=newArrival">NEW ARRIVALS <i className="fa-solid fa-chevron-down"></i></Link>
        <Link to="/shop">SHOP <i className="fa-solid fa-chevron-down"></i></Link>
        <Link to="/about">OUR STORY</Link>
        <Link to="/shop?filter=readyToShip">READY TO SHIP</Link>
        <Link to="/shop?filter=luxury">LUXURY COLLECTION</Link>
        <Link to="/shop?filter=bestseller">BESTSELLERS</Link>
        <Link to="/shop?filter=celebrity">CELEBRITY STYLE</Link>
        <Link to="/shop?filter=onSale">ON SALE</Link>
        <Link to="/category/KIDS OUTFITS">KIDS COLLECTION<i className="fa-solid fa-chevron-down"></i></Link>
      </nav>
    </header>
  );
};

export default Header;