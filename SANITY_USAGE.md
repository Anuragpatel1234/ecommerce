# Sanity CMS Usage Guide for Rangaara

Sanity is now integrated as a headless CMS to manage content like Products, Categories, and Hero Banners.

## 1. Local Studio Setup

To manage content locally:
1. Open a terminal in the `studio` directory.
2. Run `npm install` (if not already done).
3. Run `npx sanity dev` to start the local CMS editor.
4. Open `http://localhost:3333`.

## 2. Environment Variables

Ensure your `.env` file contains the following:
```env
REACT_APP_SANITY_PROJECT_ID=your_id
REACT_APP_SANITY_DATASET=production
```

## 3. Schemas

We have defined the following schemas in `studio/schemas/`:
- **Product**: Manage clothing items, prices, and images.
- **Hero Banner**: Manage the homepage slider images and text.

## 4. Using Sanity Data in React

Use the `useSanityData` hook to fetch content.

```javascript
import { useSanityData } from '../../hooks/useSanity';

const MyComponent = () => {
  const { data, loading, error } = useSanityData(`*[_type == "product"]`);
  
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      {data.map(product => (
        <h2 key={product._id}>{product.name}</h2>
      ))}
    </div>
  );
};
```

## 5. Deployment

When you are ready to go live:
1. Create a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Update the `projectId` in `sanity.config.js` and `.env`.
3. Run `npx sanity deploy` inside the `studio` folder.
