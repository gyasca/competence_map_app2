const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateStaff = (req, res, next) => {
    try {
        const accessToken = req.header("Authorization").split(" ")[1];
            if (!accessToken) {
                return res.status(401).json({message: "JWT token is required"});
            }

            const payload = verify(accessToken, process.env.APP_SECRET);
            req.user = payload;
            return next();
    }
    catch (err) {
        return res.sendStatus(401);
    }
}

module.exports = { validateStaff };