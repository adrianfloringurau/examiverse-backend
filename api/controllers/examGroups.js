import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { checkTeacher } from '../middleware/roleChecks.js';
import { getExamGroup, getExamGroups, newExamGroup } from '../functions/examGroups.js';

const examGroupsRouter = express.Router();

examGroupsRouter.route('/').get(verifyToken, async (req, res) => {
    const result = await getExamGroups();
    if (result === -1) return res.status(500).json({ error: "An error occurred while getting the exam groups." });
    return res.status(200).json(result);
});

examGroupsRouter.route('/:id').get(verifyToken, async (req, res) => {
    const id = req.params.id;
    const result = await getExamGroup(id);
    switch (result) {
        case -3: {
            return res.status(500).json({ error: "An error occurred while getting the exam group." });
        };
        case -2: {
            return res.status(404).json({ error: "Exam group does not exist." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(200).json({ result });
        };
    }
});

examGroupsRouter.route('/new').post(verifyToken, checkTeacher, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    if (!title) {
        return res.status(400).json({ error: "Title is required." });
    }
    const result = await newExamGroup(userId, title, description);
    switch (result) {
        case -2: {
            return res.status(500).json({ error: "An error occurred while creating the user." });
        };
        case -1: {
            return res.status(409).json({ error: "Title must have at least 3 characters." });
        };
        default: {
            return res.status(201).json({
                message: "Exam group created successfully.",
                examGroup: {
                    id: result.id,
                    userId: result.userId,
                    title: result.title,
                    description: result.description,
                },
            });
        };
    }
});

export default examGroupsRouter;