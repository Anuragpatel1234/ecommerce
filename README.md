# RANGAARA - Fashion E-commerce Platform

This repository contains the full source code for the RANGAARA fashion e-commerce platform. It is structured into two main components: a frontend React application and a backend Node.js/Express API.

---

## Codebase Architecture

```
rangaara/
├── frontend/             # React Frontend Application
│   ├── public/           # Static assets (images, icons, etc.)
│   ├── src/              # React components, pages, hooks, context
│   ├── .env              # Frontend configuration (ports, etc.)
│   └── package.json      # Frontend dependencies
│
├── backend/              # Node.js/Express Backend API
│   ├── middleware/       # Express middlewares (auth, validation, etc.)
│   ├── models/           # Mongoose models (Product, Order, User, etc.)
│   ├── routes/           # API routes (auth, products, checkout, etc.)
│   ├── .env              # Backend configuration (DB URI, JWT keys, etc.)
│   ├── seedData.js       # Database seeding script
│   └── package.json      # Backend dependencies
│
├── package.json          # Root manager package.json (dev orchestration)
└── README.md             # This documentation
```

---

## Tech Stack

* **Frontend**: React, React Router, Axios, CSS (Vanilla)
* **Backend**: Node.js, Express, Mongoose (MongoDB)
* **Payment**: PayPal REST Integration

---

## Installation & Setup

To get the application up and running locally, follow these steps:

### 1. Install Dependencies

Install both frontend and backend dependencies using the root orchestration command:
```bash
npm run install:all
```

### 2. Configure Environment Variables

#### Backend configuration (`backend/.env`):
Make sure to create or verify the `backend/.env` file with your MongoDB connection string and API credentials:
```env
MONGODB_URI=mongodb://localhost:27017/rangaara
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

#### Frontend configuration (`frontend/.env`):
Make sure the `frontend/.env` contains the default port configuration:
```env
PORT=3002
BROWSER=none
```

### 3. Database Seeding (Optional)

If you need to seed the MongoDB database with initial product and section data, run:
```bash
cd backend
npm run seed
```

### 4. Run Locally

To run both the React frontend (port 3002) and backend server (port 5000) concurrently, use the root dev script:
```bash
npm run dev
```