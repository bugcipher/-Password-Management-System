const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'password_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database: ' + (process.env.DB_NAME || 'password_manager'));
        connection.release();
    })
    .catch(err => {
        console.error('CRITICAL DATABASE ERROR: Could not connect to MySQL database.');
        console.error('Please verify details in server/.env and make sure MySQL service is running.');
        console.error('Error detail:', err.message);
    });

module.exports = db;
