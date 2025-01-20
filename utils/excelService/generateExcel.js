import xl from 'excel4node';
import Exam from '../databaseService/models/Exam.js';

export default function generateExcel(groupId, examId, userId) {
    if (examId) {
        // For a single exam:
        const workbook = new xl.Workbook();

        const exam = Exam.findOne({ where: { id: examId } });
        if (!exam) return -1;


        const worksheet = workbook.addWorksheet(`${exam.title}`);

    } else {
        // For an exam group:
    }
}