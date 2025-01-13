import Sequelize from 'sequelize';
import db from '../dbConfig.js';

const User = db.define("User", {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    salt: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    role: {
        type: Sequelize.ENUM('student', 'teacher', 'admin'),
        allowNull: false,
        defaultValue: 'student',
    },
});

export default User;