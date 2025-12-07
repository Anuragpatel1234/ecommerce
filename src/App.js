import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/SafeAppContext';
import './App.css';

// Lazy load components to avoid initial loading issues
const Header = React.lazy(() => import('./components/Header/Header'));
const Footer = React.lazy(() => import('./components/Footer/Footer'));
const Home = React.lazy(() => import('./pages/Home/Home'));
const Shop = React.lazy(() => import('./pages/Shop/Shop'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist/Wishlist'));
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const Profile = React.lazy(() => import('./pages/Profile/Profile'));
const Checkout = React.lazy(() => import('./pages/Checkout/Checkout'));
const Payment = React.lazy(() => import('./pages/Payment/Payment'));
const Orders = React.lazy(() => import('./pages/Orders/Orders'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage/CategoryPage'));
const About = React.lazy(() => import('./pages/About/About'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    flexDirection: 'column'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #E5E7EB',
      borderTop: '4px solid #1F2937',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }}></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
          </Suspense>
          <main>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </main>
          <Suspense fallback={<LoadingSpinner />}>
            <Footer />
          </Suspense>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;