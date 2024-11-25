import User from '../../utils/databaseService/models/User.js';
import bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

async function login(username, password) {
    try {
        const existingUser = await User.findOne({ where: { username }});
        if (!existingUser) return -1;

        const hashedPassword = await bcrypt.hash(password, existingUser.salt);

        if (hashedPassword != existingUser.password) return 0;

        const token = jwt.sign(
        {
            id: existingUser.id,
            username: existingUser.username,
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '1h'
        });

        return {
            id: existingUser.id,
            username: existingUser.username,
            token,
        };
    } catch (err) {
        console.error("Error checking user: ", err);
        return -2;
    }
}

async function getUsers() {
    try {
        const result = [];
        const users = await User.findAll();
        for (let user of users) {
            result.push({
                id: user.id,
                username: user.username,
            });
        }
        return result;
    } catch (err) {
        console.error("Error getting users: ", err);
        return -1;
    }
};

async function getUser(id) {
    try {
        if (!isUUID(id)) {
            console.error("Invalid UUID:", id);
            return -1;
        }
        const user = await User.findOne({ where: { id } });
        if (user) return {
            id: user.id,
            username: user.username,
        }
        return -2;
    } catch (err) {
        console.error("Error getting user:", err);
        return -3;
    }
}

async function newUser(username, password) {
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return -1;

        const saltRounds = process.env.SALT_ROUNDS || 10;
        const generatedSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, generatedSalt);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            salt: generatedSalt,
        });
        return newUser;
    } catch (err) {
        console.error("Error creating user: ", err);
        return -2;
    }
};

export {
    login,
    getUsers,
    getUser,
    newUser,
};