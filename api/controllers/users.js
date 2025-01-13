import express from 'express';
import { login, logout, getUser, getUsers, newUser } from '../functions/users.js';

const usersRouter = express.Router();

usersRouter.route('/').get(async (req, res) => {
    const result = await getUsers();
    if (result === -1) return res.status(500).json({ error: "An error occurred while getting the users." });
    return res.status(200).json(result);
});

usersRouter.route('/:id').get(async (req, res) => {
    const id = req.params.id;
    const result = await getUser(id);
    switch (result) {
        case -3: {
            return res.status(500).json({ error: "An error occurred while getting the user." });
        };
        case -2: {
            return res.status(404).json({ error: "User does not exist." });
        };
        case -1: {
            return res.status(400).json({ error: "Invalid UUID." });
        };
        default: {
            return res.status(200).json({ user: result });
        };
    }
});

usersRouter.route('/new').post(async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ error: "Username, password and role are required." });
    }
    const result = await newUser(username, password, role);
    switch (result) {
        case -2: {
            return res.status(500).json({ error: "An error occurred while creating the user." });
        };
        case -1: {
            return res.status(409).json({ error: "Username already exists." });
        };
        default: {
            return res.status(201).json({
                message: "User created successfully.",
                user: {
                    id: result.id,
                    username: result.username,
                },
            });
        };
    }
});

usersRouter.route('/login').post(async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }

        const result = await login(username, password);

        switch (result) {
            case -2:
                return res.status(500).json({ error: "Internal server error during login." });
            case -1:
                return res.status(404).json({ error: "User not found." });
            case 0:
                return res.status(401).json({ error: "Invalid password." });
            default:
                return res.status(200).json({
                    response: true,
                    message: "Login successful.",
                    user: {
                        id: result.id,
                        username: result.username,
                    },
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                });
        }
    } catch (error) {
        console.error("Error in login endpoint: ", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

usersRouter.route('/logout').post(async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token is required' });

        const result = await logout(refreshToken);
        if (result === true) {
            res.status(200).json({ message: 'Logged out successfully' });
        }
        else {
            res.status(400).json({ message: 'Already logged out or token does not exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to log out', error: error.message });
    }
});

export default usersRouter;