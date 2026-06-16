const crypto = require('crypto');
require('dotenv').config();

// Retrieve encryption key from env
const aesKeyHex = process.env.AES_KEY;

if (!aesKeyHex || aesKeyHex.length !== 64) {
    console.error("WARNING: AES_KEY in environment is missing or invalid. It must be exactly 64 hex characters (32 bytes). Creating a fallback key.");
}

// Ensure key is 32 bytes (256 bits)
const ENCRYPTION_KEY = aesKeyHex && aesKeyHex.length === 64 
    ? Buffer.from(aesKeyHex, 'hex')
    : crypto.scryptSync('fallback-password-manager-key-default', 'salt', 32);

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // AES blocks are 16 bytes

/**
 * Encrypt a plaintext string using AES-256-CBC
 * @param {string} text - The plaintext to encrypt
 * @returns {string} iv:encryptedData formatted string
 */
function encrypt(text) {
    if (!text) return '';
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption failed:', error.message);
        throw new Error('Encryption failed');
    }
}

/**
 * Decrypt a string using AES-256-CBC
 * @param {string} encryptedText - The iv:encryptedData formatted string
 * @returns {string} Decrypted plaintext string
 */
function decrypt(encryptedText) {
    if (!encryptedText) return '';
    try {
        const textParts = encryptedText.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid encrypted text format (missing IV separator)');
        }
        
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedData = Buffer.from(textParts.join(':'), 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        throw new Error('Decryption failed');
    }
}

module.exports = {
    encrypt,
    decrypt
};
