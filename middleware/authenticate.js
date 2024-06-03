const jwt = require('jsonwebtoken');
const { sendError } = require('../utils');

const authenticate = (req, res, next) => {
    console.log('Cookies:', req.cookies);  // Log all cookies
    const token = req.cookies.token;
    console.log('Token received:', token);  // Log the token

    if (!token) {
        console.log('No token found');  // Additional log for no token scenario
        return sendError(res, 403, 'Access denied');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if (decoded.userId) {
            req.user._id = decoded.userId;
        }
        next();
    } catch (err) {
        console.log('Invalid token:', err.message);
        return sendError(res, 401, 'Invalid token');
    }
}

module.exports = authenticate;