import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import db from '../../utils/databaseService/dbConfig.js';
import { checkAdmin } from '../middleware/roleChecks.js';

const databaseRouter = express.Router();

databaseRouter.route('/create').get(verifyToken, checkAdmin, async (req, res) => {
    try {
        await db.sync({ force: false });
        res.status(200).json({ message: 'Database synchronized successfully.' });
    } catch (error) {
        console.error('Error synchronizing database:', error);
        res.status(500).json({ message: 'Failed to synchronize database.', error: error.message });
    }
});

export default databaseRouter;