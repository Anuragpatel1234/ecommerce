const fs = require('fs');

const files = [
  'frontend/src/pages/Payment/Payment.js',
  'frontend/src/pages/Orders/Orders.js',
  'frontend/src/pages/Checkout/Checkout.js',
  'frontend/src/pages/Cart/Cart.js',
  'frontend/src/components/ProductCard/ProductCard.js',
  'frontend/src/pages/Admin/Dashboard.js',
  'frontend/src/pages/Admin/OrderDetail.js',
  'frontend/src/pages/ProductDetail/ProductDetail.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('getImageUrl')) {
    let apiImportPath = '../../config/api';
    content = content.replace(/import React[^;]*;\n/, `$&import { getImageUrl } from '${apiImportPath}';\n`);
  }
  
  content = content.replace(/src=\{item\.product(?:\?\.)?images\?\\.\[0\] \|\| 'img\/placeholder\.jpg'\}/g, 'src={getImageUrl(item.product?.images?.[0])}');
  content = content.replace(/src=\{product\.images\?\\.\[0\] \|\| 'img\/placeholder\.jpg'\}/g, 'src={getImageUrl(product.images?.[0])}');
  content = content.replace(/src=\{item\.product\.images\[0\]\}/g, 'src={getImageUrl(item.product.images[0])}');

  if (file.includes('ProductDetail.js')) {
    content = content.replace(/\s*const getImageUrl = \(imagePath\) => \{[\s\S]*?\n\s*\};/g, '');
    content = content.replace(/import \{ getImageUrl \} from '\.\.\/\.\.\/config\/api';\n/, ''); 
    content = content.replace(/import axios from 'axios';\n/, "import axios from 'axios';\nimport { getImageUrl } from '../../config/api';\n");
  }

  fs.writeFileSync(file, content);
  console.log('Updated', file);
});
