import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import { validateRefreshToken, generateAccessToken, extendTokenExpiration } from '../../utils/utils.js';

config();

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                const refreshToken = req.headers['x-refresh-token'];
                if (!refreshToken) {
                    return res.status(403).json({ error: "Token expired, and no refresh token provided." });
                }

                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    await validateRefreshToken(refreshToken);

                    const newAccessToken = generateAccessToken(decodedRefreshToken.id, decodedRefreshToken.role);
                    const extendedRefreshToken = await extendTokenExpiration(refreshToken);

                    res.setHeader('authorization', `Bearer ${newAccessToken}`);
                    res.setHeader('x-refresh-token', extendedRefreshToken);

                    req.user = decodedRefreshToken;
                    return next();
                } catch (refreshErr) {
                    return res.status(403).json({ error: "Invalid or expired refresh token." });
                }
            } else {
                return res.status(403).json({ error: "Invalid token." });
            }
        }
    } catch (error) {
        console.error("Error in token verification middleware:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


export default verifyToken;