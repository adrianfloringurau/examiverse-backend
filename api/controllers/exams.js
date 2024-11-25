import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const examsRouter = express.Router();

examsRouter.route('/').get(verifyToken, (req, res) => {
    const user = req.user;

    // Do some logic here...

    res.status(200).json({ message: 'success' });
});

export default examsRouter;