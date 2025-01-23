import User from '../../utils/databaseService/models/User.js';
import bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';
import { generateAccessToken, generateRefreshToken } from '../../utils/utils.js';
import { config } from 'dotenv';
import Token from '../../utils/databaseService/models/Token.js';

config();

async function login(username, password) {
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (!existingUser) return -1;

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) return 0;

        const accessToken = generateAccessToken(existingUser.id, existingUser.role);
        const refreshToken = await generateRefreshToken(existingUser.id, existingUser.role);

        return {
            id: existingUser.id,
            username: existingUser.username,
            role: existingUser.role,
            accessToken,
            refreshToken,
        };
    } catch (err) {
        console.error("Error during login: ", err);
        return -2;
    }
};

async function logout(refreshToken) {
    const token = await Token.findOne({ where: { refreshToken } });
    if (token && token.active === true) {
        await Token.update(
            { active: false },
            { where: { refreshToken } }
        );
        return true;
    }
    return false;
};

async function changePassword(userId, oldPassword, newPassword) {
    try {
        if (oldPassword === newPassword) return -1;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) return -2;
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return -3;
        }
        const newHashedPassword = await bcrypt.hash(newPassword, user.salt);
        user.password = newHashedPassword;
        await user.save();
        return user;
    } catch (err) {
        console.error("Error changing password: ", err);
        return -4;
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
                role: user.role,
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
            role: user.role,
        }
        return -2;
    } catch (err) {
        console.error("Error getting user:", err);
        return -3;
    }
};

async function newUser(username, password, role) {
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return -1;

        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
        const generatedSalt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, generatedSalt);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            salt: generatedSalt,
            role,
        });
        return newUser;
    } catch (err) {
        console.error("Error creating user: ", err);
        return -2;
    }
};

export {
    login,
    logout,
    changePassword,
    getUsers,
    getUser,
    newUser,
};