import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Function to set Authorization token for requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ✅ Login User
export const loginUser = async (username: string, password: string) => {
  return api.post('/auth/login', { username, password });
};

// ✅ Register User
export const registerUser = async (username: string, password: string) => {
  return api.post('/auth/register', { username, password });
};

// ✅ Helper function to get token
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).token : null;
};

// ✅ Fetch tasks with token
export const fetchTasks = async () => {
  const token = getAuthToken();
  return await api.get("/tasks", {
    headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
  });
};

// ✅ Create a task with token
export const createTask = async (title: string, description: string) => {
  const token = getAuthToken();
  return await api.post("/tasks", { title, description }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// ✅ Update Task
export const updateTask = (id: number, updates: { title?: string; description?: string; isComplete?: boolean }) => {
  return api.put(`/tasks/${id}`, updates);
};

// ✅ Delete Task
export const deleteTask = (id: number) => {
  return api.delete(`/tasks/${id}`);
};
