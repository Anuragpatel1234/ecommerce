const mongoose = require('mongoose');
const WebsiteSection = require('./models/WebsiteSection');
require('dotenv').config();

const heroSlides = [
  { 
    id: 1,
    image: 'img/pexels-vikashkr50-27103969.jpg', 
    mobileImage: '',
    subheading: 'RANGAARA AUTUMN EDIT',
    heading: 'THE ROYAL HERITAGE',
    description: 'Experience the regal elegance of handcrafted Indian couture',
    primaryBtnText: 'EXPLORE COLLECTION',
    primaryBtnUrl: '/shop',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    overlayOpacity: 0.3,
    isActive: true
  },
  { 
    id: 2,
    image: 'img/Approved_Drzya-Desktop-14.webp', 
    mobileImage: '',
    subheading: 'THE SHADI COLLECTION',
    heading: 'FESTIVE SPLENDOR',
    description: 'Premium ethnic wear designed for your special celebrations',
    primaryBtnText: 'DISCOVER NOW',
    primaryBtnUrl: '/shop?collection=Nur',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    overlayOpacity: 0.3,
    isActive: true
  },
  { 
    id: 3,
    image: 'img/Drzya-Desktop-1_2.webp', 
    mobileImage: '',
    subheading: 'ARTISANAL CHRONICLES',
    heading: 'THE ART OF WEAVING',
    description: 'Where traditional artisan techniques meet contemporary design',
    primaryBtnText: 'OUR HERITAGE',
    primaryBtnUrl: '/about',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    overlayOpacity: 0.3,
    isActive: true
  },
  { 
    id: 4,
    image: 'img/Drzya-Desktop-11.webp', 
    mobileImage: '',
    subheading: 'VELVET & TISSUE SPECIALS',
    heading: 'THE LUXURY EDIT',
    description: 'Hand-selected silk, tissue and embroidered velvet silhouettes',
    primaryBtnText: 'SHOP EXCLUSIVES',
    primaryBtnUrl: '/shop?filter=luxury',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    overlayOpacity: 0.3,
    isActive: true
  }
];

const categories = [
  { id: 1, name: 'LEHENGAS', slug: 'lehengas', image: 'img/Untitled-4.webp', isActive: true, displayOrder: 0 },
  { id: 2, name: 'SHARARA SETS', slug: 'sharara-sets', image: 'img/0952.webp', isActive: true, displayOrder: 1 },
  { id: 3, name: 'ANARKALI SETS', slug: 'anarkali-sets', image: 'img/dupatta1.webp', isActive: true, displayOrder: 2 },
  { id: 4, name: 'KURTA SETS', slug: 'kurta-sets', image: 'img/SKIRTS1.jpg', isActive: true, displayOrder: 3 },
  { id: 5, name: 'COORD SETS', slug: 'coord-sets', image: 'img/traditional outfit 2.webp', isActive: true, displayOrder: 4 },
  { id: 6, name: 'KAFTAN SETS', slug: 'kaftan-sets', image: 'img/kids lehenga set.webp', isActive: true, displayOrder: 5 },
  { id: 7, name: 'DHOTI SETS', slug: 'dhoti-sets', image: 'img/Untitled-4.webp', isActive: true, displayOrder: 6 },
  { id: 8, name: 'LOUNGE WEAR', slug: 'lounge-wear', image: 'img/0952.webp', isActive: true, displayOrder: 7 }
];

const seedCmsDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rangaara', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Seed Hero Section
    await WebsiteSection.findOneAndUpdate(
      { sectionKey: 'hero_section' },
      {
        sectionKey: 'hero_section',
        sectionName: 'Hero Section',
        sectionType: 'hero',
        isActive: true,
        isDraft: false,
        content: { slides: heroSlides }
      },
      { upsert: true, new: true }
    );
    console.log('Hero section seeded');

    // Seed Categories Section
    await WebsiteSection.findOneAndUpdate(
      { sectionKey: 'site_categories' },
      {
        sectionKey: 'site_categories',
        sectionName: 'Site Categories',
        sectionType: 'categories',
        isActive: true,
        isDraft: false,
        content: { categories }
      },
      { upsert: true, new: true }
    );
    console.log('Categories section seeded');

    console.log('CMS Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding CMS database:', error);
    process.exit(1);
  }
};

seedCmsDatabase();
