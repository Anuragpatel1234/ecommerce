import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/SafeAppContext';
import { ToastProvider } from './context/ToastContext';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';

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
const AdminLogin = React.lazy(() => import('./pages/Admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./pages/Admin/Dashboard'));
const AdminProducts = React.lazy(() => import('./pages/Admin/Products'));
const ProductForm = React.lazy(() => import('./pages/Admin/ProductForm'));
const AdminOrders = React.lazy(() => import('./pages/Admin/Orders'));
const OrderDetail = React.lazy(() => import('./pages/Admin/OrderDetail'));
const AdminUsers = React.lazy(() => import('./pages/Admin/Users'));
const Sections = React.lazy(() => import('./pages/Admin/Sections'));
const SectionForm = React.lazy(() => import('./pages/Admin/SectionForm'));
// CMS Pages
const CMSDashboard = React.lazy(() => import('./pages/Admin/CMS/CMSDashboard'));
const HeroManager = React.lazy(() => import('./pages/Admin/CMS/HeroManager'));
const BannerManager = React.lazy(() => import('./pages/Admin/CMS/BannerManager'));
const CategoryManager = React.lazy(() => import('./pages/Admin/CMS/CategoryManager'));
const HomepageManager = React.lazy(() => import('./pages/Admin/CMS/HomepageManager'));
const AboutManager = React.lazy(() => import('./pages/Admin/CMS/AboutManager'));
const TestimonialManager = React.lazy(() => import('./pages/Admin/CMS/TestimonialManager'));
const NewsletterManager = React.lazy(() => import('./pages/Admin/CMS/NewsletterManager'));
const FooterManager = React.lazy(() => import('./pages/Admin/CMS/FooterManager'));
const NavigationManager = React.lazy(() => import('./pages/Admin/CMS/NavigationManager'));
const MediaLibrary = React.lazy(() => import('./pages/Admin/CMS/MediaLibrary'));
const SiteSettings = React.lazy(() => import('./pages/Admin/CMS/SiteSettings'));

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

// Component to conditionally show Header/Footer
const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      {!isAdminRoute && (
        <Suspense fallback={<LoadingSpinner />}>
          <Header />
        </Suspense>
      )}
      <main className={isHomePage ? 'home-main' : 'other-main'}>
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="sections" element={<Sections />} />
              <Route path="sections/new" element={<SectionForm />} />
              <Route path="sections/:id/edit" element={<SectionForm />} />
              {/* Website CMS Routes */}
              <Route path="cms" element={<CMSDashboard />} />
              <Route path="cms/hero" element={<HeroManager />} />
              <Route path="cms/banners" element={<BannerManager />} />
              <Route path="cms/categories" element={<CategoryManager />} />
              <Route path="cms/homepage" element={<HomepageManager />} />
              <Route path="cms/about" element={<AboutManager />} />
              <Route path="cms/testimonials" element={<TestimonialManager />} />
              <Route path="cms/newsletter" element={<NewsletterManager />} />
              <Route path="cms/footer" element={<FooterManager />} />
              <Route path="cms/navigation" element={<NavigationManager />} />
              <Route path="cms/media" element={<MediaLibrary />} />
              <Route path="cms/settings" element={<SiteSettings />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && (
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      )}
      <ScrollToTopButton />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;