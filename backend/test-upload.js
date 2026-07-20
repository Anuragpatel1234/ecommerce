const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign(
  { user: { id: '123456789012', role: 'admin' } }, 
  process.env.JWT_SECRET || 'your_jwt_secret_key_here', 
  { expiresIn: '1h' }
);

async function run() {
  try {
    fs.writeFileSync('test-image.jpg', Buffer.from('fake image content ' + Date.now()));
    
    const form = new FormData();
    form.append('images', fs.createReadStream('test-image.jpg'));

    const response = await fetch('http://localhost:5000/api/admin/upload', {
      method: 'POST',
      headers: {
        'x-auth-token': token
      },
      body: form // node-fetch handles form-data headers if using node-fetch, but with native fetch we need to let it set the boundary. Wait, FormData from 'form-data' package might need special handling. Let's stick to node-fetch or just tell the user to test.

run();
