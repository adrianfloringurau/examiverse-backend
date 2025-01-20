import { validate as isUUID } from 'uuid';
import Exam from "../../utils/databaseService/models/Exam.js";
import Entry from '../../utils/databaseService/models/Entry.js';

async function signExam(userId, examId, password) {
    try {
        if (!isUUID(examId)) {
            console.error("Invalid UUID:", examId);
            return -1;
        }
        const exam = await Exam.findOne({ where: { id: examId }});
        if (!exam) return -2;
        if (!password) return -3;
        if (password !== exam.password) return -4;
        const existentEntry = await Entry.findOne({ where: { userId, examId }});
        if (existentEntry) return -5;
        const currentDate = new Date();
        if (currentDate < exam.startTime) return -7;
        if (currentDate > exam.endTime) return -8;
        const newEntry = await Entry.create({
            userId,
            examId,
            signTime: currentDate,
        });
        return newEntry;
    } catch (err) {
        console.error("Error creating entry: ", err);
        return -6;
    }
};

export {
    signExam,
}