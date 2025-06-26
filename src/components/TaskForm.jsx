import { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
    const [taskTitle, setTaskTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskTitle.trim()) {
            onAddTask(taskTitle);
            setTaskTitle('');
        }
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input 
                type="text" 
                className="title" 
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Enter a new task..."
            />
            <button type="submit">Add Task</button>
        </form>
    );
}

export default TaskForm;
