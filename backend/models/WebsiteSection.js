const mongoose = require('mongoose');

const websiteSectionSchema = new mongoose.Schema({
  sectionKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sectionName: {
    type: String,
    required: true,
    trim: true
  },
  sectionType: {
    type: String,
    required: true,
    enum: [
      'hero', 'featured', 'testimonial', 'banner', 'text', 'gallery', 'custom',
      'newsletter', 'footer', 'navigation', 'about', 'categories', 'homepage',
      'product_section', 'site_settings'
    ],
    default: 'custom'
  },
  title: {
    type: String,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  images: [{
    url: String,
    alt: String,
    order: Number
  }],
  links: [{
    text: String,
    url: String,
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WebsiteSection', websiteSectionSchema);
