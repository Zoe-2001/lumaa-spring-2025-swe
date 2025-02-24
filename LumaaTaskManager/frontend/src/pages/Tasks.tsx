import React, { useEffect, useState, useContext } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!auth?.user) {
      navigate('/login');
    } else {
      fetchTasks()
        .then(res => setTasks(res.data as Task[]))
        .catch(err => console.error("Error fetching tasks:", err));
    }
  }, [auth, navigate]);

  // Handle task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await createTask(newTaskTitle, newTaskDescription);
      setTasks([...tasks, res.data]); // Add new task to state
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  // Handle task completion
  const handleComplete = async (id: number) => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token; // ✅ Retrieve the stored token

        if (!token) {
            console.error("No token found. User is not authenticated.");
            return;
        }

        await axios.put(
            `${API_URL}/tasks/${id}`,
            { isComplete: true }, // Send the correct payload
            {
                headers: {
                    "Authorization": `Bearer ${token}`, // Include the JWT
                    "Content-Type": "application/json"
                }
            }
        );

        setTasks(tasks.map(task => 
            task.id === id ? { ...task, isComplete: true } : task
        ));
    } catch (error) {
        console.error("Error updating task:", error);
    }
  };


  // Handle task deletion
  const handleDelete = async (id: number) => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user?.token; // Retrieve stored JWT

        if (!token) {
            console.error("No token found. User is not authenticated.");
            return;
        }

        await axios.delete(`${API_URL}/tasks/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`, // Include JWT token in headers
                "Content-Type": "application/json"
            }
        });

        // Remove the deleted task from state
        setTasks(tasks.filter(task => task.id !== id));

    } catch (error) {
        console.error("Error deleting task:", error);
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Task List</h2>

      {/* ✅ Task Creation Form */}
      <form onSubmit={handleCreateTask} className="mb-4">
        <input
          className="border p-2 w-full"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task Title"
          required
        />
        <input
          className="border p-2 w-full mt-2"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Task Description (optional)"
        />
        <button type="submit" className="bg-green-500 text-white p-2 mt-4">Create Task</button>
      </form>

      {/* ✅ Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between p-2 border mb-2">
            <div>
              <span className={`mr-4 ${task.isComplete ? "line-through text-gray-500" : ""}`}>
                {task.title} {task.description && `- ${task.description}`}
              </span>
            </div>
            <div>
              {!task.isComplete && (
                <button onClick={() => handleComplete(task.id)} className="bg-blue-500 text-white p-1 rounded mr-2">
                  Mark Complete
                </button>
              )}
              <button onClick={() => handleDelete(task.id)} className="bg-red-500 text-white p-1 rounded">
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
