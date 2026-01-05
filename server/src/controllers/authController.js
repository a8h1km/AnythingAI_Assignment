const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const redisClient = require('../config/redis');

const generateTokens = async (userId, role) => {
    const accessToken = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    await redisClient.set(`refresh_token:${refreshToken}`, userId, {
        EX: 7 * 24 * 60 * 60
    });

    return { accessToken, refreshToken };
};

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // Set true in production
        sameSite: 'lax',
        maxAge: 10 * 1000 // 10 seconds
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await generateTokens(user.id, user.role);

        setCookies(res, accessToken, refreshToken);

        res.json({ message: "Login successful", role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const redisKey = `refresh_token:${refreshToken}`;
        const storedUserId = await redisClient.get(redisKey);

        if (!storedUserId) {
            return res.status(403).json({ message: "Invalid or Expired Refresh Token" });
        }

        await redisClient.del(redisKey);

        const user = await User.findByPk(storedUserId);
        const newTokens = await generateTokens(user.id, user.role);

        setCookies(res, newTokens.accessToken, newTokens.refreshToken);

        res.json({ message: "Token refreshed" });

    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};


exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // 1. Remove from Redis (if it exists)
        if (refreshToken) {
            await redisClient.del(`refresh_token:${refreshToken}`);
        }

        // 2. Define exactly how cookies were set
        // (Must match the options in setCookies function)
        const cookieOptions = {
            httpOnly: true,
            secure: false, // Set to true if you used true in login
            sameSite: 'lax'
        };

        // 3. Clear Cookies with options
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Even if Redis fails, we should still clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logged out (with error)" });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        res.status(201).json({ message: "User registered successfully!", userId: user.id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};