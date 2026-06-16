const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Console logs for incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Import database pool to trigger test connection on load
require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

// Map routes
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Password Manager Server is healthy and running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  PASSWORD MANAGEMENT SYSTEM API SERVER IS RUNNING     `);
    console.log(`  Local Access: http://localhost:${PORT}                `);
    console.log(`=======================================================`);
});
