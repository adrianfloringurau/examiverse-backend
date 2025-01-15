import ExamGroup from "../../utils/databaseService/models/ExamGroup.js";
import { validate as isUUID } from 'uuid';

async function newExamGroup(userId, title, description) {
    try {
        if (title.length < 3) {
            return -1;
        }
        const newExamGroup = await ExamGroup.create({
            userId,
            title,
            description,
        });
        return newExamGroup;
    } catch (err) {
        console.error("Error creating exam group: ", err);
        return -2;
    }
};

async function getExamGroups(role, userId) {
    try {
        const result = [];
        const examGroups = (role === 'teacher') ? await ExamGroup.findAll({ where: { userId } }) : await ExamGroup.findAll();
        for (let examGroup of examGroups) {
            result.push({
                examGroup
            });
        }
        return result;
    } catch (err) {
        console.error("Error getting exam groups: ", err);
        return -1;
    }
};

async function getExamGroup(id, role, userId) {
    try {
        if (!isUUID(id)) {
            console.error("Invalid UUID:", id);
            return -1;
        }
        const examGroup = (role === 'teacher') ? await ExamGroup.findOne({ where: { id, userId }}) : await ExamGroup.findOne({ where: { id } });
        if (examGroup) return examGroup;
        return -2;
    } catch (err) {
        console.error("Error getting exam group:", err);
        return -3;
    }
}

export {
    newExamGroup,
    getExamGroups,
    getExamGroup,
};