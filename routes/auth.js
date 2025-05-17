const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user database
const users = new Map();

// Login route
router.post('/login', (req, res) => {
    // TODO: Implement actual Roblox authentication
    const mockUser = {
        id: '12345',
        username: req.body.username || 'TestUser',
        role: req.body.role || 'passenger'
    };

    const token = jwt.sign(mockUser, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({ token, user: mockUser });
});

// Verify gamepass
router.get('/verify-gamepass/:userId', (req, res) => {
    // TODO: Implement actual Roblox gamepass verification
    res.json({
        hasGamepass: false,
        message: 'User does not own the Business Class gamepass'
    });
});

// Get user profile
router.get('/profile', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        res.json(user);
    } catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
});

module.exports = router;
