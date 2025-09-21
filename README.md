# Meesho MERN Stack Application

A basic MERN stack web application for searching and displaying product feeds based on user queries.

## Features

- React frontend with Tailwind CSS for styling
- Express backend with a search API endpoint
- Mock product data (with MongoDB schema ready for future integration)
- Responsive product card grid layout
- Search functionality with loading states

## Project Structure

```
project/
├── backend/
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── searchRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductGrid.js
│   │   │   └── SearchBar.js
│   │   ├── pages/
│   │   │   └── HomePage.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (for future integration)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd meesho-mern-app
   ```

2. Install dependencies for the root project, backend, and frontend:
   ```
   npm run install-all
   ```
   
   Alternatively, you can install dependencies separately:
   ```
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Running the Application

To run both the frontend and backend concurrently:

```
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Running Separately

To run the backend only:
```
npm run server
```

To run the frontend only:
```
npm run client
```

## API Endpoints

### Search Products
- **URL**: `/api/search`
- **Method**: POST
- **Body**:
  ```json
  {
    "query": "Navratri clothes under 3000"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "query": "Navratri clothes under 3000",
    "products": [
      {
        "id": "1",
        "title": "Product Title",
        "price": 2499,
        "description": "Product description",
        "imageUrl": "image-url"
      },
      ...
    ]
  }
  ```

## Future Enhancements

- Connect to MongoDB for real product data
- Add user authentication
- Implement advanced search filters
- Add product detail pages
- Implement cart functionality

