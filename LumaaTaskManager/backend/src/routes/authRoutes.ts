import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// ✅ Correctly pass async functions without wrapping them unnecessarily
router.post('/register', async (req, res, next) => {
    try {
        await register(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        await login(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;
