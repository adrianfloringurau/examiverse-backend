import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const db = new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'localhost',
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true,
    },
});

export default db;