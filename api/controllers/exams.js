import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import { getExam, getExamPassword, getExams, newExam } from '../functions/exams.js';
import { checkTeacher } from '../middleware/roleChecks.js';

const examsRouter = express.Router();

examsRouter.route('/:groupId').get(verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
    const result = await getExams(groupId);
    switch (result) {
        case -3: {
            return res.status(500).json({ error: "An error occurred while getting the exams." });
        };
        case -2: {
            return res.status(404).json({ error: "Exam group does not exist." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(200).json(result);
        };
    }
});

examsRouter.route('/:groupId/:examId').get(verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
    const examId = req.params.examId;
    const result = await getExam(groupId, examId);
    switch (result) {
        case -5: {
            return res.status(500).json({ error: "An error occurred while getting the exam." });
        };
        case -4: {
            return res.status(404).json({ error: "Exam does not exist." });
        };
        case -3: {
            return res.status(404).json({ error: "Exam group does not exist." });
        };
        case -2: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(200).json(result);
        };
    }
});

examsRouter.route('/:groupId/:examId/password').get(verifyToken, checkTeacher, async (req, res) => {
    const groupId = req.params.groupId;
    const examId = req.params.examId;
    const userId = req.user.id;
    const result = await getExamPassword(userId, groupId, examId);
    switch (result) {
        case -6: {
            return res.status(500).json({ error: "An error occurred while getting the exam." });
        };
        case -5: {
            return res.status(404).json({ error: "Exam does not exist." });
        };
        case -4: {
            return res.status(409).json({ error: "You are not the owner of this exam group." });
        };
        case -3: {
            return res.status(404).json({ error: "Exam group does not exist." });
        };
        case -2: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(200).json(result);
        };
    }
});

examsRouter.route('/new').post(verifyToken, checkTeacher, async (req, res) => {
    const { groupId, startTime, endTime, title, description, password } = req.body;
    const userId = req.user.id;
    if (!groupId || !startTime || !endTime || !title || !password) {
        return res.status(400).json({ error: "Group ID, start time, end time, title and password are required." });
    }
    const result = await newExam(userId, groupId, startTime, endTime, title, description, password);
    switch (result) {
        case -5: {
            return res.status(500).json({ error: "An error occurred while creating the exam." });
        };
        case -4: {
            return res.status(400).json({ error: "Start time has to be before the end time." });
        };
        case -3: {
            return res.status(409).json({ error: "You are not the owner of this exam group." });
        };
        case -2: {
            return res.status(409).json({ error: "Exam group does not exist." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(201).json({
                message: "Exam created successfully.",
                exam: {
                    id: result.id,
                    groupId: result.groupId,
                    startTime: result.startTime,
                    endTime: result.endTime,
                    title: result.title,
                    description: result.description,
                },
            });
        };
    }
});

export default examsRouter;