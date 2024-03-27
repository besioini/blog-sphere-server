const jwt = require('jsonwebtoken');
const { sendError } = require('../utils');

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return sendError(res, 403, 'Access denied');
    }

    try {
        // Verify the token using your JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user payload to the request
        req.user = decoded
        next();
    } catch (err) {
        return sendError(res, 401, 'Invalid token')
    }
}

module.exports = authenticate;