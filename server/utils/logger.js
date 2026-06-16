const db = require('../config/db');

/**
 * Log an action in the database audit_log table
 * @param {number} userId - ID of the user performing action
 * @param {string} action - Action description (e.g. 'REGISTER', 'LOGIN', 'ADD_PASSWORD')
 * @param {string|null} websiteName - Name of the website involved (optional)
 * @param {string|null} ipAddress - IP address of the client request (optional)
 */
async function logAction(userId, action, websiteName = null, ipAddress = null) {
    try {
        await db.query(
            'INSERT INTO audit_log (user_id, action, website_name, ip_address) VALUES (?, ?, ?, ?)',
            [userId, action, websiteName, ipAddress]
        );
    } catch (error) {
        console.error(`FAILED TO WRITE AUDIT LOG: [User ID: ${userId}, Action: ${action}]`, error.message);
    }
}

module.exports = {
    logAction
};
