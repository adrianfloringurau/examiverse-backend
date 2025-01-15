import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import User from './User.js';
import Exam from './Exam.js';

const Entry = db.define("Entry", {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    examId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: Exam,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
});

Entry.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

Entry.belongsTo(Exam, {
    foreignKey: 'examId',
    as: 'exam',
});

export default Entry;