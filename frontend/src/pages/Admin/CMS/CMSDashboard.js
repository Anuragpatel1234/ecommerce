import React from 'react';
import { Link } from 'react-router-dom';
import './CMSDashboard.css';

const CMS_SECTIONS = [
  {
    key: 'hero',
    label: 'Hero Section',
    description: 'Manage hero slides, headings, CTA buttons and background images.',
    icon: 'fa-solid fa-image',
    path: '/admin/cms/hero',
    color: '#5B1E23'
  },
  {
    key: 'banners',
    label: 'Promotional Banners',
    description: 'Create, edit and schedule promotional banner campaigns.',
    icon: 'fa-solid fa-rectangle-ad',
    path: '/admin/cms/banners',
    color: '#7c3aed'
  },
  {
    key: 'categories',
    label: 'Categories',
    description: 'Manage shop categories — names, images, order and active state.',
    icon: 'fa-solid fa-th-large',
    path: '/admin/cms/categories',
    color: '#0891b2'
  },
  {
    key: 'homepage',
    label: 'Homepage Sections',
    description: 'Show, hide and reorder sections on the homepage.',
    icon: 'fa-solid fa-house',
    path: '/admin/cms/homepage',
    color: '#059669'
  },
  {
    key: 'about',
    label: 'About Section',
    description: 'Edit the brand story, statistics, images and CTA.',
    icon: 'fa-solid fa-circle-info',
    path: '/admin/cms/about',
    color: '#d97706'
  },
  {
    key: 'testimonials',
    label: 'Testimonials',
    description: 'Manage customer testimonials with names, ratings and images.',
    icon: 'fa-solid fa-star',
    path: '/admin/cms/testimonials',
    color: '#ea580c'
  },
  {
    key: 'newsletter',
    label: 'Newsletter Section',
    description: 'Edit the newsletter heading, description and CTA button.',
    icon: 'fa-solid fa-envelope',
    path: '/admin/cms/newsletter',
    color: '#0284c7'
  },
  {
    key: 'footer',
    label: 'Footer',
    description: 'Update footer links, social icons, copyright text and contact info.',
    icon: 'fa-solid fa-shoe-prints',
    path: '/admin/cms/footer',
    color: '#475569'
  },
  {
    key: 'navigation',
    label: 'Navigation Menu',
    description: 'Build the header menu — add, remove and reorder nav items.',
    icon: 'fa-solid fa-bars',
    path: '/admin/cms/navigation',
    color: '#be185d'
  },
  {
    key: 'media',
    label: 'Media Library',
    description: 'Upload, browse and manage all website images centrally.',
    icon: 'fa-solid fa-photo-film',
    path: '/admin/cms/media',
    color: '#4f46e5'
  },
  {
    key: 'settings',
    label: 'Site Settings',
    description: 'Site name, logo, favicon, contact info and social media links.',
    icon: 'fa-solid fa-gear',
    path: '/admin/cms/settings',
    color: '#374151'
  },
];

const CMSDashboard = () => {
  return (
    <div className="cms-dashboard">
      <div className="cms-dashboard__header">
        <div>
          <h1 className="cms-dashboard__title">Website CMS</h1>
          <p className="cms-dashboard__subtitle">
            Manage every section of your website without writing any code.
          </p>
        </div>
      </div>

      <div className="cms-dashboard__grid">
        {CMS_SECTIONS.map((section) => (
          <Link
            key={section.key}
            to={section.path}
            className="cms-section-card"
          >
            <div
              className="cms-section-card__icon-wrap"
              style={{ background: section.color + '15', color: section.color }}
            >
              <i className={section.icon}></i>
            </div>
            <div className="cms-section-card__body">
              <h3 className="cms-section-card__title">{section.label}</h3>
              <p className="cms-section-card__desc">{section.description}</p>
            </div>
            <div className="cms-section-card__arrow">
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CMSDashboard;
