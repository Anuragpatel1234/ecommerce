# CMS (Content Management System) Usage Guide

## Overview
The CMS allows you to manage content for different sections of your website through the admin panel without needing to modify code.

## Accessing the CMS

1. Login to the admin panel: `/admin/login`
2. Navigate to **"Website Sections"** in the sidebar menu
3. You can now view, create, edit, and delete website sections

## Creating a New Section

1. Click **"Add New Section"** button
2. Fill in the required fields:
   - **Section Key**: Unique identifier (e.g., `hero-slider`, `featured-banner`)
   - **Section Name**: Display name (e.g., "Hero Slider", "Featured Banner")
   - **Section Type**: Choose from Hero, Featured, Testimonial, Banner, Text, Gallery, or Custom
3. Add content:
   - Title, Subtitle, Description
   - Images (with URLs and alt text)
   - Links (internal or external)
4. Set order and active status
5. Click **"Create Section"**

## Section Types

### Hero
- For hero sliders and main banner sections
- Typically includes multiple images

### Featured
- For featured product collections
- Can include product links

### Testimonial
- For customer testimonials
- Includes text content and author info

### Banner
- For promotional banners
- Simple image + text combinations

### Text
- For text-only sections
- Rich content areas

### Gallery
- For image galleries
- Multiple images in grid layout

### Custom
- For custom sections
- Flexible content structure

## Using CMS Data in Components

### Example: Using the `useSection` Hook

```javascript
import { useSection } from '../../hooks/useSection';

const MyComponent = () => {
  const { section, loading, error } = useSection('hero-slider');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!section) return <div>No section found</div>;
  
  return (
    <div>
      <h1>{section.title}</h1>
      <p>{section.description}</p>
      {section.images.map((img, i) => (
        <img key={i} src={img.url} alt={img.alt} />
      ))}
    </div>
  );
};
```

### Example: Fetching Multiple Sections

```javascript
import { useSections } from '../../hooks/useSection';

const MyComponent = () => {
  const { sections, loading } = useSections('banner');
  
  return (
    <div>
      {sections.map(section => (
        <div key={section._id}>
          <h2>{section.title}</h2>
        </div>
      ))}
    </div>
  );
};
```

## Section Data Structure

```javascript
{
  sectionKey: "hero-slider",        // Unique identifier
  sectionName: "Hero Slider",       // Display name
  sectionType: "hero",              // Type of section
  title: "Welcome to RANGAARA",     // Main title
  subtitle: "Premium Fashion",      // Subtitle
  description: "Description text",   // Full description
  content: {},                       // Custom content object
  images: [                         // Array of images
    {
      url: "https://example.com/img.jpg",
      alt: "Image description",
      order: 0
    }
  ],
  links: [                          // Array of links
    {
      text: "Shop Now",
      url: "/shop",
      type: "internal"              // or "external"
    }
  ],
  isActive: true,                   // Show on website
  order: 0,                         // Display order
  metadata: {}                       // Additional data
}
```

## API Endpoints

### Public Endpoints (No authentication required)
- `GET /api/sections` - Get all active sections
- `GET /api/sections?type=hero` - Get sections by type
- `GET /api/sections/:key` - Get section by key

### Admin Endpoints (Authentication required)
- `GET /api/admin/sections` - Get all sections (including inactive)
- `GET /api/admin/sections/:id` - Get section by ID
- `POST /api/admin/sections` - Create new section
- `PUT /api/admin/sections/:id` - Update section
- `DELETE /api/admin/sections/:id` - Delete section

## Best Practices

1. **Section Keys**: Use lowercase, hyphen-separated keys (e.g., `hero-slider`, `featured-collection`)
2. **Images**: Use full URLs or relative paths from the public folder
3. **Ordering**: Use order numbers to control display sequence (lower numbers appear first)
4. **Active Status**: Only active sections are visible on the public website
5. **Testing**: Always test sections after creation to ensure they display correctly

## Common Use Cases

### Hero Slider
- Section Key: `hero-slider`
- Type: `hero`
- Add multiple images in the images array
- Set order to 0 to appear first

### Featured Banner
- Section Key: `featured-banner`
- Type: `banner`
- Add one main image
- Include a link to a product or category

### Testimonial Section
- Section Key: `testimonials`
- Type: `testimonial`
- Use description for testimonial text
- Add author info in metadata

## Troubleshooting

- **Section not showing**: Check if `isActive` is set to `true`
- **Images not loading**: Verify image URLs are correct and accessible
- **API errors**: Ensure the backend server is running on port 5000
- **Permission denied**: Make sure you're logged in as an admin user

