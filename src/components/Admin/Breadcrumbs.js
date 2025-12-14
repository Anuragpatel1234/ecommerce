import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="admin-breadcrumbs">
      <Link to="/admin/dashboard" className="breadcrumb-link">
        <i className="fa-solid fa-home"></i> Dashboard
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="breadcrumb-separator">
            <i className="fa-solid fa-chevron-right"></i>
          </span>
          {index === items.length - 1 ? (
            <span className="breadcrumb-current">{item.label}</span>
          ) : (
            <Link to={item.path} className="breadcrumb-link">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

