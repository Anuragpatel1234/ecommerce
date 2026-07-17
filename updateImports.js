const fs = require('fs');

const files = [
  'frontend/src/pages/Payment/Payment.js',
  'frontend/src/pages/Orders/Orders.js',
  'frontend/src/pages/Checkout/Checkout.js',
  'frontend/src/pages/Cart/Cart.js',
  'frontend/src/pages/Admin/Dashboard.js',
  'frontend/src/pages/Admin/OrderDetail.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import { getImageUrl }')) {
    let apiImportPath = '../../config/api';
    content = content.replace(/import /, `import { getImageUrl } from '${apiImportPath}';\nimport `);
    fs.writeFileSync(file, content);
    console.log('Added import to', file);
  }
});
