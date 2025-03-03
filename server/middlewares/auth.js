const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        const error = new Error('Unauthorized: No token provided');
        error.status = 401;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        error.message = 'Unauthorized: Invalid token';
        error.status = 403;
        next(error);            
    }
};

const logRequests = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);  // Fixed template string
    next();
};

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[Error] ${status} - ${message}`);
    res.status(status).json({ status, message });
};

module.exports = {isAuthenticated, logRequests, errorHandler };
