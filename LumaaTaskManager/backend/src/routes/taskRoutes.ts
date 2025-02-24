import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { authenticateJWT } from "../middleware/authMiddleware.js"; // ✅ Ensure correct import

const router = express.Router();

router.get("/", authenticateJWT, getTasks);
router.post("/", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, deleteTask);

export default router;
