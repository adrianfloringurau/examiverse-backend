import xl from 'excel4node';
import Exam from '../databaseService/models/Exam.js';
import Entry from '../databaseService/models/Entry.js';
import User from '../databaseService/models/User.js';

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
            row++;
        }

        fileName = `${exam.id}_${Date.now()}.xlsx`;
    } else {
        // For an exam group:
    }
    const buffer = await workbook.writeToBuffer();
    const buffer64Base = Buffer.from(buffer).toString('base64');
    return {
        fileName,
        buffer: buffer64Base,
    };
}