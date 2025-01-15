import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import ExamGroup from './ExamGroup.js';

const Exam = db.define("Exam", {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    groupId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
            model: ExamGroup,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    startTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    endTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
});

Exam.belongsTo(ExamGroup, {
    foreignKey: 'groupId',
    as: 'group',
});

export default Exam;