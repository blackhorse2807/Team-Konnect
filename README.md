# Meesho MERN Stack Application

A comprehensive MERN stack web application designed for searching and displaying product feeds based on user queries.

## Features

- **Frontend**: Built with React and styled using Tailwind CSS for a modern and responsive UI.
- **Backend**: Powered by Express, featuring a robust search API endpoint.
- **Data**: Utilizes mock product data with MongoDB schema ready for future integration.
- **UI Components**: Includes a responsive product card grid layout and search functionality with loading states.

## Project Structure

```
project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
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

- **Node.js**: Version 14 or higher is recommended.
- **Package Manager**: npm or yarn.
- **MongoDB**: Required for future data integration.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Meesho
   ```

2. **Install dependencies**:
   - For the entire project:
     ```bash
     npm run install-all
     ```
   - Alternatively, install dependencies separately:
     ```bash
     npm install
     cd backend && npm install
     cd ../frontend && npm install
     ```

## Running the Application

To run both the frontend and backend concurrently:
```bash
npm run dev
```
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Running Separately

- **Backend only**:
  ```bash
  npm run server
  ```

- **Frontend only**:
  ```bash
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

- Integrate MongoDB for real product data.
- Implement user authentication.
- Add advanced search filters.
- Develop product detail pages.
- Implement cart functionality.

