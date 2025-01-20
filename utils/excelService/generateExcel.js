import xl from 'excel4node';
import Exam from '../databaseService/models/Exam.js';
import Entry from '../databaseService/models/Entry.js';
import User from '../databaseService/models/User.js';
import ExamGroup from '../databaseService/models/ExamGroup.js';

export default async function generateExcel(groupId, examId, userId) {
    const workbook = new xl.Workbook();
    let fileName = null;
    if (examId) {
        // For a single exam:

        const exam = await Exam.findOne({ where: { id: examId } });
        if (!exam) return -1;

        const worksheet = workbook.addWorksheet(`${exam.title}`);

        worksheet.cell(1, 1).string('User\'s ID');
        worksheet.cell(1, 2).string('Username');
        worksheet.cell(1, 3).string('Sign time');

        const entries = await Entry.findAll({
            where: { examId },
            include: [
                {
                    model: User,
                    as: 'user', // Alias defined in the `Entry` model
                    attributes: ['username'], // Only fetch the username
                },
            ],
        });

        let row = 2;
        for (let entry of entries) {
            worksheet.cell(row, 1).string(entry.userId);
            worksheet.cell(row, 2).string(entry.user.username);
            worksheet.cell(row, 3).string(entry.signTime.toString());
            row++;
        }

        fileName = `${exam.id}_${Date.now()}.xlsx`;
    } else {
        // For an exam group:

        const examGroup = await ExamGroup.findOne({ where: { id: groupId }});
        if (!examGroup) return -2;

        const exams = await Exam.findAll({ where: { groupId } });

        const groupWorksheet = workbook.addWorksheet(`${examGroup.title}`);

        groupWorksheet.cell(1, 1).string("Exam ID");
        groupWorksheet.cell(1, 2).string("Exam Title");
        groupWorksheet.cell(1, 3).string("No. of entries");


        let grrow = 2;
        for (let exam of exams) {
            groupWorksheet.cell(grrow, 1).string(exam.id);
            groupWorksheet.cell(grrow, 2).string(exam.title);

            let worksheet = workbook.addWorksheet(`${exam.title}`);

            worksheet.cell(1, 1).string('User\'s ID');
            worksheet.cell(1, 2).string('Username');
            worksheet.cell(1, 3).string('Sign time');

            const examId = exam.id;

            const entries = await Entry.findAll({
                where: { examId },
                include: [
                    {
                        model: User,
                        as: 'user', // Alias defined in the `Entry` model
                        attributes: ['username'], // Only fetch the username
                    },
                ],
            });

            const sum = entries.length;
            groupWorksheet.cell(grrow, 3).string(sum.toString());

            let row = 2;
            for (let entry of entries) {
                worksheet.cell(row, 1).string(entry.userId);
                worksheet.cell(row, 2).string(entry.user.username);
                worksheet.cell(row, 3).string(entry.signTime.toString());
                row++;
            }

            grrow++;
        }

        fileName = `${examGroup.id}_${Date.now()}.xlsx`;
    }
    const buffer = await workbook.writeToBuffer();
    const buffer64Base = Buffer.from(buffer).toString('base64');
    return {
        fileName,
        buffer: buffer64Base,
    };
}