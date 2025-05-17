const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Role verification middleware
const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: 'Access denied',
                message: `This action requires one of the following roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

// Gamepass verification middleware
const verifyGamepass = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        // TODO: Implement actual Roblox gamepass verification
        const hasGamepass = false;

        if (!hasGamepass) {
            return res.status(403).json({
                error: 'Gamepass required',
                message: 'You need to own the Business Class gamepass to access this feature'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify gamepass' });
    }
};

module.exports = {
    authenticateToken,
    verifyRole,
    verifyGamepass
};
