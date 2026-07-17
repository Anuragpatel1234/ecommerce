import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, currency, cart, wishlist, setCurrency, logout } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);

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
      setIsMobileMenuOpen(false);
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

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken && user) {
        // Check if user has admin role
        try {
          const response = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
            headers: { 'x-auth-token': adminToken }
          });
          setIsAdmin(response.data.role === 'admin');
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  return (
    <header id="navbar-section" className={`${isScrolled ? 'scrolled' : ''} ${isHomePage ? 'home-header' : 'other-header'}`}>
      <div className="top-header">
        <div className="header-left">
          <div className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              id="desktop-search"
              name="search"
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
              src={process.env.PUBLIC_URL + "/img/RANGAARA-navbar-logo.png"}
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
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="admin-link"
                    >
                      <i className="fa-solid fa-shield-halved"></i> Admin Panel
                    </Link>
                  )}
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

          <Link to="/wishlist" className="header-icon desktop-wishlist-icon">
            <i className="fa-regular fa-heart"></i>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>

          <div
            className={`currency-dropdown ${isCurrencyDropdownOpen ? 'active' : ''}`}
            ref={dropdownRef}
          >
            <span className="currency-selector" onClick={toggleCurrencyDropdown}>
              <span className="selected-flag">{currencies.find(c => c.code === currency)?.flag}</span> <i className="fa-solid fa-chevron-down"></i>
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
      <nav className={`main-navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>


        <div 
          className="nav-item-with-dropdown"
        >
          <Link 
            to="/shop?filter=newArrival" 
            onClick={(e) => {
              e.preventDefault();
              setActiveDropdown(activeDropdown === 'newArrivals' ? null : 'newArrivals');
            }}
          >
            NEW ARRIVALS <i className="fa-solid fa-chevron-down"></i>
          </Link>
          {activeDropdown === 'newArrivals' && (
            <div className="mega-dropdown">
              <div className="dropdown-column">
                <Link to="/shop?collection=Jameela" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Jameela</Link>
                <Link to="/shop?collection=Nur" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Nur</Link>
                <Link to="/shop?collection=Dilbaro Tissue" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro Tissue</Link>
                <Link to="/shop?collection=Dilbaro Embroidered Velvets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro Embroidered Velvets</Link>
                <Link to="/shop?collection=Dilbaro" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro</Link>
                <Link to="/shop?collection=Zoya" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Zoya</Link>
                <Link to="/shop?collection=Boond 3.0" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Boond 3.0</Link>
                <Link to="/shop?collection=Phillauri 2" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Phillauri 2</Link>
                <Link to="/shop?collection=Gulzaar" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Gulzaar</Link>
                <Link to="/shop?collection=Ishq" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Ishq</Link>
                <Link to="/shop?collection=Kapaas" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kapaas</Link>
                <Link to="/shop?collection=Layla Florals" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Layla Florals</Link>
                <Link to="/shop?collection=Gulmohar Khari 25" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Gulmohar Khari 25</Link>
                <Link to="/shop?collection=Gulmohar Block Prints" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Gulmohar Block Prints</Link>
                <Link to="/shop?collection=Gulmohar" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Gulmohar</Link>
              </div>
            </div>
          )}
        </div>

        <div 
          className="nav-item-with-dropdown"
        >
          <Link 
            to="/shop" 
            onClick={(e) => {
              e.preventDefault();
              setActiveDropdown(activeDropdown === 'shop' ? null : 'shop');
            }}
          >
            SHOP <i className="fa-solid fa-chevron-down"></i>
          </Link>
          {activeDropdown === 'shop' && (
            <div className="mega-dropdown mega-dropdown-shop">
              <div className="dropdown-column">
                <div className="dropdown-header">STYLES</div>
                <Link to="/shop?category=Co-ord Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Co-ord Sets</Link>
                <Link to="/shop?category=Lehengas" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Lehengas</Link>
                <Link to="/shop?category=Sarees" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Sarees</Link>
                <Link to="/shop?category=Anarkali Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Anarkali Sets</Link>
                <Link to="/shop?category=Sharara Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Sharara Sets</Link>
                <Link to="/shop?category=Kurta Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kurta Sets</Link>
                <Link to="/shop?category=Kaftan Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kaftan Sets</Link>
                <Link to="/shop?category=Dhoti Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dhoti Sets</Link>
              </div>
              <div className="dropdown-column">
                <div className="dropdown-header">COLLECTIONS</div>
                <Link to="/shop?collection=Jameela" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Jameela</Link>
                <Link to="/shop?collection=Nur" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Nur</Link>
                <Link to="/shop?collection=Dilbaro Tissue" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro Tissue</Link>
                <Link to="/shop?collection=Dilbaro Embroidered Velvets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro Embroidered Velvets</Link>
                <Link to="/shop?collection=Dilbaro" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dilbaro</Link>
                <Link to="/shop?collection=Zoya" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Zoya</Link>
                <Link to="/shop?collection=Boond 3.0" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Boond 3.0</Link>
                <Link to="/shop?collection=Phillauri 2" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Phillauri 2</Link>
              </div>
              <div className="dropdown-column">
                <div className="dropdown-header">MORE</div>
                <Link to="/shop?filter=bestseller" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Best Sellers</Link>
                <Link to="/shop?category=Accessories" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Accessories</Link>
                <Link to="/shop?category=Home Edit" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Home Edit</Link>
              </div>
              <div className="dropdown-column">
                <div className="dropdown-header">ACCESSORIES</div>
                <Link to="/shop?category=Tote Bags" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Tote Bags</Link>
                <Link to="/shop?category=Potli Bags" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Potli Bags</Link>
                <Link to="/shop?category=Shawls" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Shawls</Link>
                <Link to="/shop?category=Caps" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Caps</Link>
                <Link to="/shop?category=Dupattas" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Dupattas</Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>OUR STORY</Link>
        <Link to="/shop?filter=readyToShip" onClick={() => setIsMobileMenuOpen(false)}>READY TO SHIP</Link>
        <Link to="/shop?filter=luxury" onClick={() => setIsMobileMenuOpen(false)}>LUXURY COLLECTION</Link>
        <Link to="/shop?filter=bestseller" onClick={() => setIsMobileMenuOpen(false)}>BESTSELLERS</Link>
        <Link to="/shop?filter=onSale" onClick={() => setIsMobileMenuOpen(false)}>ON SALE</Link>

        <div 
          className="nav-item-with-dropdown"
        >
          <Link 
            to="/category/KIDS OUTFITS" 
            onClick={(e) => {
              e.preventDefault();
              setActiveDropdown(activeDropdown === 'kids' ? null : 'kids');
            }}
          >
            KIDS COLLECTION<i className="fa-solid fa-chevron-down"></i>
          </Link>
          {activeDropdown === 'kids' && (
            <div className="mega-dropdown">
              <div className="dropdown-column">
                <Link to="/category/KIDS OUTFITS?type=Lehengas" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Lehengas</Link>
                <Link to="/category/KIDS OUTFITS?type=Anarkali" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Anarkali</Link>
                <Link to="/category/KIDS OUTFITS?type=Kurta Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Kurta Sets</Link>
                <Link to="/category/KIDS OUTFITS?type=Co-ord Sets" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Co-ord Sets</Link>
                <Link to="/category/KIDS OUTFITS?type=Party Wear" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Party Wear</Link>
                <Link to="/category/KIDS OUTFITS?type=Casual Wear" className="dropdown-item" onClick={() => { setIsMobileMenuOpen(false); setActiveDropdown(null); }}>Kids Casual Wear</Link>
              </div>
            </div>
          )}
        </div>

        <Link to="/wishlist" className="mobile-wishlist-nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>WISHLIST</span>
          {wishlist.length > 0 && (
            <span className="wishlist-menu-badge" style={{
              backgroundColor: 'var(--color-primary-maroon)',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>{wishlist.length}</span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;