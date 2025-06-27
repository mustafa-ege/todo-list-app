import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'to-do'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskData.title.trim()) {
            onAddTask(taskData);
            setTaskData({ title: '', description: '', status: 'to-do' });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="title"
                className="title" 
                value={taskData.title}
                onChange={handleChange}
                placeholder="Enter a new task..."
                required
            />
            <textarea
                name="description"
                className="description"
                value={taskData.description}
                onChange={handleChange}
                placeholder="Task description (optional)"
                rows="3"
            />
            <select 
                name="status" 
                className="status-select"
                value={taskData.status}
                onChange={handleChange}
            >
                <option value="to-do">To Do</option>
                <option value="doing">Doing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskForm;
