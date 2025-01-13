import express from 'express';
import cors from 'cors';
import usersRouter from './api/controllers/users.js';
import examsRouter from './api/controllers/exams.js';
import databaseRouter from './api/controllers/database.js';
import helmet from 'helmet';
import { config } from 'dotenv';
import { cleanupExpiredTokens } from './utils/utils.js';
import schedule from 'node-schedule';

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static('public'));
app.use(cors());
app.use(helmet());

schedule.scheduleJob('0 0 * * *', cleanupExpiredTokens); // Runs daily at midnight

app.use('/api/database', databaseRouter);
app.use('/api/users', usersRouter);
app.use('/api/exams', examsRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    .json({
        message: err.message,
        error: err,
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("BE running on PORT " + port);
});