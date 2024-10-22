const jwt = require('jsonwebtoken');

// Replace this with your actual secret key or retrieve it from environment variables
const secretKey = process.env.JWT_SECRET;

// Function to decode and verify the JWT token
function decodeToken(token) {
    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, secretKey);
        return decoded; // Contains user info from the token payload
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}

module.exports = decodeToken;
