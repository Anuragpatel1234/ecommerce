import React from 'react';
import { Button } from './Button';
import './MenuToggle.css';

const MenuToggle = ({ onToggle, isOpen = false, className = '' }) => {
  return (
    <Button
      className={`menu-toggle-button ${className} ${isOpen ? 'open' : ''}`}
      variant="outline"
      size="icon"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg
        className="menu-toggle-icon"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12L20 12"
          className={`menu-line menu-line-1 ${isOpen ? 'open' : ''}`}
        />
        <path
          d="M4 12H20"
          className={`menu-line menu-line-2 ${isOpen ? 'open' : ''}`}
        />
        <path
          d="M4 12H20"
          className={`menu-line menu-line-3 ${isOpen ? 'open' : ''}`}
        />
      </svg>
    </Button>
  );
};

export default MenuToggle;

