const jwt = require('jsonwebtoken');

exports.authorize = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient role permissions.' });
            }

            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    };
};
