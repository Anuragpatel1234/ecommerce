import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Simple test components
const TestHome = () => <div>Home Page</div>;
const TestShop = () => <div>Shop Page</div>;

function TestApp() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <a href="/">Home</a> | <a href="/shop">Shop</a>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<TestHome />} />
            <Route path="/shop" element={<TestShop />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default TestApp;