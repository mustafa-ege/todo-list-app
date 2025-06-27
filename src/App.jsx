import { useState, useEffect } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import SearchBar from './components/SearchBar'

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please check if the server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = task.description && 
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || descriptionMatch;
    });

    setFilteredTasks(filtered);
  };

  const addTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const newTask = await response.json();
      const updatedTasks = [newTask, ...tasks];
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? updatedTask : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <h1>Todo List</h1>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Todo List</h1>
      {error && <div className="error-message">{error}</div>}
      <TaskForm onAddTask={addTask} />
      <SearchBar onSearch={handleSearch} />
      <TaskList tasks={filteredTasks} onDeleteTask={deleteTask} onUpdateTask={updateTask} />
    </div>
  )
}

export default App
