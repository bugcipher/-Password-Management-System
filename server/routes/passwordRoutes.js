const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    addPassword,
    getAllPasswords,
    decryptPassword,
    deletePassword,
    getAuditLogs
} = require('../controllers/passwordController');

// All routes here are protected with authMiddleware
router.use(authMiddleware);

// Route: GET /api/passwords
router.get('/', getAllPasswords);

// Route: POST /api/passwords
router.post('/', addPassword);

// Route: GET /api/passwords/:id/decrypt
router.get('/:id/decrypt', decryptPassword);

// Route: DELETE /api/passwords/:id
router.delete('/:id', deletePassword);

// Route: GET /api/passwords/audit-logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
