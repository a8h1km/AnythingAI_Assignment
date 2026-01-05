const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: "Access Token Missing" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token Expired" });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Require Admin Role!" });
    }
    next();
};