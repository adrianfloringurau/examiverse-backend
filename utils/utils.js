import jwt from 'jsonwebtoken';
import Token from './databaseService/models/Token.js';

function generateAccessToken(userId, userRole) {
    const payload = {
        id: userId,
        role: userRole,
    };

    return `Bearer ${jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })}`;
}

async function generateRefreshToken(userId, userRole) {
    const payload = {
        id: userId,
        role: userRole,
    };

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await Token.create({
        userId: userId,
        refreshToken,
        expiresAt,
        active: true,
    });

    return refreshToken;
};

async function validateRefreshToken(refreshToken) {
    const tokenRecord = await Token.findOne({ where: { refreshToken, active: true } });
    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
        throw new Error('Invalid or expired refresh token');
    }
};

async function extendTokenExpiration(refreshToken) {
    const tokenRecord = await Token.findOne({ where: { refreshToken, active: true } });
    if (!tokenRecord) {
        throw new Error('Token not found or inactive');
    }

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getHours() + 1);

    tokenRecord.expiresAt = newExpiresAt;
    await tokenRecord.save();

    return tokenRecord.refreshToken;
};

async function cleanupExpiredTokens() {
    try {
        const now = new Date();
        let deletedCount = 0;
        const batchSize = 100;
        let hasMore = true;

        while (hasMore) {
            const batchDeleted = await Token.destroy({
                where: {
                    [Sequelize.Op.or]: [
                        { active: false },
                        { expiresAt: { [Sequelize.Op.lt]: now } },
                    ],
                },
                limit: batchSize, // Use batching
            });
            deletedCount += batchDeleted;
            hasMore = batchDeleted > 0;
        }
        console.log(`${deletedCount} expired tokens cleaned up.`);
    } catch (error) {
        console.error("Error cleaning up expired tokens:", error);
    }
};

function codifyRole(userRole) {
    if (userRole === 'teacher' || userRole === 'admin') return true;
    return false;
}

export {
    generateAccessToken,
    generateRefreshToken,
    validateRefreshToken,
    extendTokenExpiration,
    cleanupExpiredTokens,
    codifyRole,
}