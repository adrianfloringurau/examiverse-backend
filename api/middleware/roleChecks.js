const checkAdmin = (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

const checkTeacher = (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teachers only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

const checkStudent = (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'student') {
            return res.status(403).json({ message: 'Access denied. Students only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

const checkTeacherOrAdmin = (req, res, next) => {
    try {
        const userRole = req.user.role;

        if (userRole !== 'teacher' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Teachers and admins only.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

export {
    checkAdmin,
    checkTeacher,
    checkStudent,
    checkTeacherOrAdmin,
};