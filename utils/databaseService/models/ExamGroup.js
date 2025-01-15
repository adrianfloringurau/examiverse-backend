import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import User from './User.js';

const ExamGroup = db.define("ExamGroup", {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
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
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

ExamGroup.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export default ExamGroup;