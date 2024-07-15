const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    try {
        const accessToken = req.header("Authorization").split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({ error: "User not logged in!" });
        }

        const payload = verify(accessToken, process.env.APP_SECRET);
        req.user = payload;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: "Token is invalid" });
    }
}

const validateAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'staff') {
        return next();
    } else {
        return res.status(403).json({ error: "Access denied. Admin only." });
    }
}

module.exports = { validateToken, validateAdmin };