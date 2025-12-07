# RANGAARA - React Fashion E-commerce

This is a React conversion of the RANGAARA fashion e-commerce website. The original HTML/CSS/JavaScript code has been converted to a modern React application with component-based architecture.

## Features

- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Hero Slider**: Auto-playing image carousel with navigation dots
- **Product Sections**: Multiple product display sections with hover effects
- **Currency Dropdown**: Multi-currency support with flag icons
- **Testimonial Carousel**: Auto-scrolling customer testimonials
- **Newsletter Signup**: Email subscription form
- **Smooth Animations**: CSS animations and transitions throughout

## Components Structure

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.js
│   │   └── Header.css
│   ├── HeroSection/
│   │   ├── HeroSection.js
│   │   └── HeroSection.css
│   ├── ShopCategories/
│   │   ├── ShopCategories.js
│   │   └── ShopCategories.css
│   ├── ProductSection/
│   │   ├── ProductSection.js
│   │   └── ProductSection.css
│   ├── HandcraftSection/
│   │   ├── HandcraftSection.js
│   │   └── HandcraftSection.css
│   ├── ShopSection/
│   │   ├── ShopSection.js
│   │   └── ShopSection.css
│   ├── FeaturedCollection/
│   │   ├── FeaturedCollection.js
│   │   └── FeaturedCollection.css
│   ├── Marquee/
│   │   ├── Marquee.js
│   │   └── Marquee.css
│   ├── ScrollingEffect/
│   │   ├── ScrollingEffect.js
│   │   └── ScrollingEffect.css
│   ├── TestimonialSection/
│   │   ├── TestimonialSection.js
│   │   └── TestimonialSection.css
│   └── Footer/
│       ├── Footer.js
│       └── Footer.css
├── App.js
├── App.css
├── index.js
└── index.css
```

## Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Key React Features Implemented

### State Management
- **Hero Slider**: Uses `useState` and `useEffect` for slide management and auto-play
- **Currency Dropdown**: State-controlled dropdown with outside click detection
- **Newsletter Form**: Controlled form input with state management

### React Hooks Used
- `useState`: For managing component state
- `useEffect`: For side effects like intervals and event listeners
- `useRef`: For DOM element references

### Event Handling
- Click handlers for navigation and interactions
- Form submission handling
- Scroll-to-top functionality

### Component Architecture
- Modular component structure
- Reusable components with props
- Separation of concerns with individual CSS files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Optimized images and assets
- CSS animations using GPU acceleration
- Efficient React rendering with proper key props
- Lazy loading ready structure

## Responsive Breakpoints

- Desktop: 1020px and above
- Tablet/Mobile: Below 1020px

## External Dependencies

- **Font Awesome**: For icons
- **Google Fonts**: Open Sans font family
- **React**: ^18.2.0
- **React DOM**: ^18.2.0

The application maintains the original design and functionality while providing a modern React-based architecture for better maintainability and scalability.