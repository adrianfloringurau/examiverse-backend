import { config } from 'dotenv';
import pg from 'pg';

config();

const dbName = process.env.DB_DATABASE;

const pool = new pg.Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'localhost',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

async function createDatabase() {
    let client = undefined;
    try {
        client = await pool.connect();
        console.log("Connected to the database!");

        // Check if the database exists
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
        );

        if (res.rowCount === 0) {
            // Create the database if it doesn't exist
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database '${dbName}' created successfully.`);
        } else {
            console.log(`Database '${dbName}' already exists.`);
        }
    } catch (err) {
        console.error("Error while creating database: ", err.stack);
    } finally {
        client.release();
        await pool.end();
    }
}

async function createTables() {
    const tablePool = new pg.Pool({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        host: process.env.DB_HOST || 'localhost',
        database: dbName,
    });

    let client = undefined;
    try {
        client = await tablePool.connect();
        console.log("Connected to the 'Products' database!");

        // Ensure the uuid-ossp extension is enabled for UUID generation
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

        await client.query(`
            CREATE TABLE IF NOT EXISTS public."User"
            (
                id uuid NOT NULL,
                username text COLLATE pg_catalog."default" NOT NULL,
                password text COLLATE pg_catalog."default" NOT NULL,
                salt text COLLATE pg_catalog."default" NOT NULL,
                CONSTRAINT "PK_ID" PRIMARY KEY (id),
                CONSTRAINT "UQ_USERNAME" UNIQUE (username)
            )
            TABLESPACE pg_default;
        `);
        console.log("Table 'User' created or already exists.");

        await client.query(`
            ALTER TABLE IF EXISTS public."User"
            OWNER TO postgres;
        `);
    } catch (err) {
        console.error("Error while creating tables: ", err.stack);
    } finally {
        client.release();
        await tablePool.end();
    }
}

async function setupDatabase() {
    await createDatabase();
    await createTables();
}

export {
    setupDatabase,
};