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
      alt: 'Jogiya Collection'
    },
    {
      id: 2,
      title: 'BLOUSES',
      image: 'img/0952.webp',
      alt: 'Malka Collection'
    },
    {
      id: 3,
      title: 'DUPATTA',
      image: 'img/dupatta1.webp',
      alt: 'Taal Collection'
    },
    {
      id: 4,
      title: 'SKIRTS',
      image: 'img/SKIRTS1.jpg',
      alt: 'Taal Collection'
    },
    {
      id: 5,
      title: 'TRADITIONAL OUTFIT',
      image: 'img/traditional outfit 2.webp',
      alt: 'Taal Collection'
    },
    {
      id: 6,
      title: 'KIDS OUTFITS',
      image: 'img/kids lehenga set.webp',
      alt: 'Taal Collection'
    }
  ];

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="shop-categories-section">
      <h2 className="common-heading center">Shop Categories</h2>
      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <div className="category-image">
              <img src={category.image} alt={category.alt} />
              <div className="category-overlay">
                <h3 className="category-title">{category.title}</h3>
                <button 
                  className="category-btn"
                  onClick={() => handleCategoryClick(category.title)}
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