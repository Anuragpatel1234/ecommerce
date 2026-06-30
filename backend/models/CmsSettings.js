const mongoose = require('mongoose');

const cmsSettingsSchema = new mongoose.Schema({
  // Singleton - only one document
  siteName: {
    type: String,
    default: 'Rangaara'
  },
  tagline: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  mobileLogo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  // Contact Info
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    googleMapsLink: { type: String, default: '' }
  },
  // Social Media
  social: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    twitter: { type: String, default: '' },
    pinterest: { type: String, default: '' }
  },
  // SEO Defaults
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    canonicalUrl: { type: String, default: '' },
    noIndex: { type: Boolean, default: false }
  },
  // Footer
  footer: {
    description: { type: String, default: '' },
    copyright: { type: String, default: '' },
    quickLinks: [{
      label: String,
      url: String,
      order: Number
    }],
    policies: [{
      label: String,
      url: String
    }],
    paymentIcons: [String],
    trustBadges: [String]
  },
  // Announcement bar
  announcementBar: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: '' },
    link: { type: String, default: '' },
    bgColor: { type: String, default: '#5B1E23' },
    textColor: { type: String, default: '#ffffff' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CmsSettings', cmsSettingsSchema);
