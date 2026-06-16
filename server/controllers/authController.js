const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logAction } = require('../utils/logger');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_token_key_for_pwd_manager_777';

/**
 * Handle user registration
 */
async function register(req, res) {
    const { username, email, master_password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Validation
    if (!username || !email || !master_password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // Check if user already exists
        const [existingUser] = await db.query(
            'SELECT user_id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash master password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(master_password, salt);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (username, email, master_password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const newUserId = result.insertId;

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: newUserId, username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Audit Logs: User Registered and Logged In
        await logAction(newUserId, 'REGISTER', null, ipAddress);
        await logAction(newUserId, 'LOGIN', null, ipAddress);

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                user_id: newUserId,
                username,
                email
            }
        });

    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).json({ message: 'Server error during registration' });
    }
}

/**
 * Handle user login
 */
async function login(req, res) {
    const { email, master_password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Validation
    if (!email || !master_password) {
        return res.status(400).json({ message: 'Please enter both email and master password' });
    }

    try {
        // Find user by email
        const [rows] = await db.query(
            'SELECT user_id, username, email, master_password FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(master_password, user.master_password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Audit Logs: User Logged In
        await logAction(user.user_id, 'LOGIN', null, ipAddress);

        return res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = {
    register,
    login
};
