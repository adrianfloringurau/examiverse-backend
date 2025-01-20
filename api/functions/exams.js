import ExamGroup from "../../utils/databaseService/models/ExamGroup.js";
import Exam from "../../utils/databaseService/models/Exam.js";
import { validate as isUUID } from 'uuid';
import { codifyRole } from "../../utils/utils.js";

async function newExam(userId, groupId, startTime, endTime, title, description, password) {
    try {
        if (!isUUID(groupId)) {
            console.error("Invalid UUID:", groupId);
            return -1;
        }
        const examGroup = await ExamGroup.findOne({ where: { id: groupId } });
        if (!examGroup) {
            return -2;
        }
        if (examGroup.userId !== userId) {
            return -3;
        }
        if (startTime >= endTime) {
            return -4;
        }
        const newExam = await Exam.create({
            groupId,
            startTime,
            endTime,
            title,
            description,
            password,
        });
        return newExam;
    } catch (err) {
        console.error("Error creating exam: ", err);
        return -5;
    }
};

async function getExams(groupId, role, userId) {
    try {
        if (!isUUID(groupId)) {
            console.error("Invalid UUID:", groupId);
            return -1;
        }
        const examGroup = (role === 'teacher') ? await ExamGroup.findOne({ where: { id: groupId, userId } }) : await ExamGroup.findOne({ where: { id: groupId } });
        if (!examGroup) return -2;
        const result = [];
        const exams = await Exam.findAll({ where: { groupId } });
        for (let exam of exams) {
            result.push({
                id: exam.id,
                groupId: exam.groupId,
                startTime: exam.startTime,
                endTime: exam.endTime,
                title: exam.title,
                description: exam.description,
            });
        }
        return result;
    } catch (err) {
        console.error("Error getting exams: ", err);
        return -3;
    }
};

async function getExam(groupId, examId, role, userId) {
    try {
        if (!isUUID(groupId)) {
            console.error("Invalid UUID:", groupId);
            return -1;
        }
        if (!isUUID(examId)) {
            console.error("Invalid UUID:", examId);
            return -2;
        }
        const examGroup = (role === 'teacher') ? await ExamGroup.findOne({where: { id: groupId, userId } }) : await ExamGroup.findOne({ where: { id: groupId } });
        if (!examGroup) return -3;
        const exam = await Exam.findOne({ where: { id: examId, groupId }});
        if (!exam) return -4;
        const result = {
            id: exam.id,
            groupId: exam.groupId,
            startTime: exam.startTime,
            endTime: exam.endTime,
            title: exam.title,
            description: exam.description,
            isEditor: codifyRole(role),
        };
        return result;
    } catch (err) {
        console.error("Error getting exams: ", err);
        return -5;
    }
};

async function getExamPassword(userId, groupId, examId) {
    try {
        if (!isUUID(groupId)) {
            console.error("Invalid UUID:", groupId);
            return -1;
        }
        if (!isUUID(examId)) {
            console.error("Invalid UUID:", examId);
            return -2;
        }
        const examGroup = await ExamGroup.findOne({ where: { id: groupId } });
        if (!examGroup) return -3;
        if (examGroup.userId !== userId) {
            return -4;
        }
        const exam = await Exam.findOne({ where: { id: examId, groupId }});
        if (!exam) return -5;
        const result = {
            password: exam.password,
        };
        return result;
    } catch (err) {
        console.error("Error getting exam's password: ", err);
        return -6;
    }
};

export {
    newExam,
    getExams,
    getExam,
    getExamPassword,
};