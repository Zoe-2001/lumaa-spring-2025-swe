import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // ✅ Add .js
import taskRoutes from './routes/taskRoutes.js'; // ✅ Add .js
import { sequelize } from './models/index.js'; // ✅ Add .js


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());// ✅ Make sure JSON parsing is enabled

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Sync database
sequelize.sync().then(() => console.log("Database connected"));

app.get('/', (req, res) => {
    res.send('Task Management API is running!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));


