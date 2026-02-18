# ShopHub - E-Commerce Website

A full-stack e-commerce website built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: Register, login, JWT-based auth
- **Product Catalog**: Browse products with search, filter, and sort
- **Shopping Cart**: Add/remove items, adjust quantities
- **Checkout**: Complete orders with shipping address
- **Order History**: View past orders and their status
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: React.js, React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
e-commerce website/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── context/        # React Context (Auth, Cart)
│       └── services/       # API calls
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── controllers/        # (optional) Route handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
└── package.json            # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   Or install each separately:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure environment variables**
   
   Create `server/.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key_here
   ```

4. **Seed the database** (optional, adds sample products)
   ```bash
   cd server
   node seed.js
   ```

### Running the Application

**Development mode** (runs both server and client):
```bash
npm run dev
```

**Run server only**:
```bash
npm run server:dev
```

**Run client only**:
```bash
npm run client
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update item quantity
- `DELETE /api/cart/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/pay` - Mark order as paid

## Default Admin Account

After seeding the database:
- Email: admin@example.com
- Password: admin123
