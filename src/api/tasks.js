import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTasks = async (userId) => {
  const response = await axios.get(`${API_URL}/tasks?userId=${userId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await axios.patch(`${API_URL}/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
  return response.data;
};