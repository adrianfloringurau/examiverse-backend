import Sequelize from 'sequelize';
import db from '../dbConfig.js';
import User from './User.js';

const Token = db.define("Token", {
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
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
    },
    expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
    },
});

Token.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

export default Token;