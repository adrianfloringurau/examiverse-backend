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

export default checkAdmin;