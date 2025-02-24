import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Initialize Sequelize FIRST
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: process.env.LOGGING === 'true',
  }
);

// ✅ Import models AFTER initializing Sequelize
import UserModel from './user.js';
import TaskModel from './task.js';

// ✅ Pass sequelize instance to models separately
export const User = UserModel(sequelize);
export const Task = TaskModel(sequelize);

// ✅ Sync models with the database
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synced successfully"))
  .catch((error) => console.error("❌ Database sync failed:", error));

export default sequelize;
