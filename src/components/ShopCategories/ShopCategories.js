import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopCategories.css';

const ShopCategories = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 1,
      title: 'LEHENGAS',
      image: 'img/Untitled-4.webp',
      alt: 'Lehengas Collection'
    },
    {
      id: 2,
      title: 'SHARARA SETS',
      image: 'img/0952.webp',
      alt: 'Sharara Sets Collection'
    },
    {
      id: 3,
      title: 'ANARKALI SETS',
      image: 'img/dupatta1.webp',
      alt: 'Anarkali Sets Collection'
    },
    {
      id: 4,
      title: 'KURTA SETS',
      image: 'img/SKIRTS1.jpg',
      alt: 'Kurta Sets Collection'
    },
    {
      id: 5,
      title: 'COORD SETS',
      image: 'img/traditional outfit 2.webp',
      alt: 'Coord Sets Collection'
    },
    {
      id: 6,
      title: 'KAFTAN SETS',
      image: 'img/kids lehenga set.webp',
      alt: 'Kaftan Sets Collection'
    },
    {
      id: 7,
      title: 'DHOTI SETS',
      image: 'img/Untitled-4.webp',
      alt: 'Dhoti Sets Collection'
    },
    {
      id: 8,
      title: 'LOUNGE WEAR',
      image: 'img/0952.webp',
      alt: 'Lounge Wear Collection'
    }
  ];

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="shop-categories-section">
      <h2 className="common-heading center">Shop by Categories</h2>
      <div className="categories-container">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-card"
            onClick={() => handleCategoryClick(category.title)}
          >
            <div className="category-image-section">
              <img src={`/${category.image}`} alt={category.alt} />
              <div className="category-text-overlay">
                <h3 className="category-title">{category.title}</h3>
                <button 
                  className="category-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.title);
                  }}
                >
                  VIEW PRODUCT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopCategories;