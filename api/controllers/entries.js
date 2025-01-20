import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { signExam } from '../functions/entries.js';
import { checkStudent } from '../middleware/roleChecks.js';

const entriesRouter = express.Router();

entriesRouter.route('/sign/:examId').post(verifyToken, checkStudent, async (req, res) => {
    const userId = req.user.id;
    const examId = req.params.examId;
    const { password } = req.query;
    const result = await signExam(userId, examId, password);
    switch (result) {
        case -8: {
            return res.status(403).json({ error: "Exam is closed." });
        };
        case -7: {
            return res.status(403).json({ error: "Exam is not opened yet." });
        };
        case -6: {
            return res.status(500).json({ error: "An error occurred while creating the entry." });
        };
        case -5: {
            return res.status(409).json({ error: "You already signed this exam." });
        };
        case -4: {
            return res.status(403).json({ error: "Wrong password." });
        };
        case -3: {
            return res.status(400).json({ error: "No password provided." });
        };
        case -2: {
            return res.status(404).json({ error: "Exam does not exist." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(201).json({
                message: "Entry created successfully.",
                result,
            });
        };
    }
});

export default entriesRouter;