const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/cryptoHelper');
const { logAction } = require('../utils/logger');

/**
 * Add a new password entry
 */
async function addPassword(req, res) {
    const { website_name, website_url, login_username, password } = req.body;
    const userId = req.user.user_id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    if (!website_name || !login_username || !password) {
        return res.status(400).json({ message: 'Website name, username, and password are required' });
    }

    try {
        // Encrypt the password using helper
        const encryptedPassword = encrypt(password);

        // Save to Database
        const [result] = await db.query(
            'INSERT INTO passwords (user_id, website_name, website_url, login_username, encrypted_password) VALUES (?, ?, ?, ?, ?)',
            [userId, website_name, website_url || null, login_username, encryptedPassword]
        );

        // Audit Log
        await logAction(userId, 'ADD_PASSWORD', website_name, ipAddress);

        return res.status(201).json({
            message: 'Password saved successfully',
            password_id: result.insertId,
            website_name,
            website_url,
            login_username
        });
    } catch (error) {
        console.error('Add password error:', error.message);
        return res.status(500).json({ message: 'Server error while saving password' });
    }
}

/**
 * Get all password entries for the logged-in user
 * Does NOT return the decrypted passwords, only metadata for security
 */
async function getAllPasswords(req, res) {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.query(
            'SELECT password_id, website_name, website_url, login_username, created_at FROM passwords WHERE user_id = ? ORDER BY website_name ASC',
            [userId]
        );

        return res.json(rows);
    } catch (error) {
        console.error('Get passwords error:', error.message);
        return res.status(500).json({ message: 'Server error while fetching passwords' });
    }
}

/**
 * Retrieve and decrypt a single password
 */
async function decryptPassword(req, res) {
    const { id } = req.params;
    const userId = req.user.user_id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        const [rows] = await db.query(
            'SELECT password_id, website_name, login_username, encrypted_password, user_id FROM passwords WHERE password_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        const entry = rows[0];

        // Check ownership
        if (entry.user_id !== userId) {
            return res.status(403).json({ message: 'Access denied: Unauthorized action' });
        }

        // Decrypt password
        const decryptedPassword = decrypt(entry.encrypted_password);

        // Audit Log
        await logAction(userId, 'VIEW_PASSWORD', entry.website_name, ipAddress);

        return res.json({
            password_id: entry.password_id,
            website_name: entry.website_name,
            login_username: entry.login_username,
            decrypted_password: decryptedPassword
        });
    } catch (error) {
        console.error('Decrypt password error:', error.message);
        return res.status(500).json({ message: 'Server error during password decryption' });
    }
}

/**
 * Delete a password entry
 */
async function deletePassword(req, res) {
    const { id } = req.params;
    const userId = req.user.user_id;
    const ipAddress = req.ip || req.connection.remoteAddress;

    try {
        // Fetch website_name first for audit logging
        const [rows] = await db.query(
            'SELECT website_name, user_id FROM passwords WHERE password_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        const entry = rows[0];

        // Check ownership
        if (entry.user_id !== userId) {
            return res.status(403).json({ message: 'Access denied: Unauthorized action' });
        }

        // Perform deletion
        await db.query('DELETE FROM passwords WHERE password_id = ?', [id]);

        // Audit Log
        await logAction(userId, 'DELETE_PASSWORD', entry.website_name, ipAddress);

        return res.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.error('Delete password error:', error.message);
        return res.status(500).json({ message: 'Server error during password deletion' });
    }
}

/**
 * Get activity logs for the current user
 */
async function getAuditLogs(req, res) {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.query(
            'SELECT log_id, action, website_name, ip_address, timestamp FROM audit_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 100',
            [userId]
        );

        return res.json(rows);
    } catch (error) {
        console.error('Get audit logs error:', error.message);
        return res.status(500).json({ message: 'Server error while fetching audit logs' });
    }
}

module.exports = {
    addPassword,
    getAllPasswords,
    decryptPassword,
    deletePassword,
    getAuditLogs
};
