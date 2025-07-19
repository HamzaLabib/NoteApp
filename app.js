const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./server/routes/noteRoutes');
const userRoutes = require('./server/routes/userRoutes');
const connectDB = require('./server/config/db');
const {logRequests, errorHandler, isAuthenticated} = require('./server/middlewares/auth');

// Load environment variables
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logRequests);

// Serve static files from client directory
app.use(express.static('client'));

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);

// use error middleware
app.use(errorHandler);

// Start the server
const PORT = 5002;
//const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
