import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // Ensure JWT_SECRET is set in .env
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables!");
}

/** 
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({ username, password: hashedPassword });

        // Ensures that the user is retrieved after creation so id is properly returned
        const savedUser = await User.findOne({ where: { username } });

        if (!savedUser) {
            return res.status(500).json({ error: 'User registration failed' });
        }
        
        return res.status(201).json({ message: 'User registered successfully', userId: savedUser.getDataValue('id') });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * @desc Login user and return JWT token
 * @route POST /auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { username, password } = req.body;

        console.log("Login attempt for:", username);

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user by username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log("User found:", user.get());

        // ✅ Extract the password correctly
        const hashedPassword = user.getDataValue('password');
        console.log("Hashed password from DB:", hashedPassword);

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user.getDataValue('id'), username: user.getDataValue('username') },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("JWT Token Generated:", token);

        return res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
