import { Request, Response } from 'express';
import { Task } from '../models/index.js';


export const getTasks = async (req: Request, res: Response) => {
    const tasks = await Task.findAll();
    res.json(tasks);
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description } = req.body;
        const userId = (req as any).user.id; // ✅ Get user ID from JWT

        if (!userId) {
            res.status(401).json({ error: "Unauthorized: User ID is missing from token" });
            return;
        }

        const newTask = await Task.create({
            title,
            description,
            userId,
            isComplete: false,
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
  

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id; // ✅ Get user ID from JWT
        const taskId = parseInt(req.params.id, 10);

        if (!userId) {
            res.status(401).json({ error: "Unauthorized: User ID is missing from token" });
            return;
        }

        const task = await Task.findOne({ where: { id: taskId, userId } });

        if (!task) {
            res.status(404).json({ error: "Task not found or not authorized to update" });
            return;
        }

        await task.update(req.body);
        res.json({ message: "Task updated successfully" });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id; // ✅ Get user ID from JWT
        const taskId = parseInt(req.params.id, 10);

        if (!userId) {
            res.status(401).json({ error: "Unauthorized: User ID is missing from token" });
            return;
        }

        const task = await Task.findOne({ where: { id: taskId, userId } });

        if (!task) {
            res.status(404).json({ error: "Task not found or not authorized to delete" });
            return;
        }

        await task.destroy();
        res.json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
