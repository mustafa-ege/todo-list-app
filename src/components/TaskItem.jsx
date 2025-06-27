import { useState } from 'react';

const TaskItem = ({ task, onDeleteTask, onUpdateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: task.title,
        description: task.description || '',
        status: task.status || 'to-do'
    });

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({
            title: task.title,
            description: task.description || '',
            status: task.status || 'to-do'
        });
    };

    const handleSave = () => {
        if (editData.title.trim()) {
            onUpdateTask(task.id, editData);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            title: task.title,
            description: task.description || '',
            status: task.status || 'to-do'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'to-do': return '#ff9800';
            case 'doing': return '#2196f3';
            case 'completed': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#666';
        }
    };

    if (isEditing) {
        return (
            <div className="task-item editing">
                <div className="edit-form">
                    <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleChange}
                        className="edit-title"
                        required
                    />
                    <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleChange}
                        className="edit-description"
                        placeholder="Description (optional)"
                        rows="2"
                    />
                    <select
                        name="status"
                        value={editData.status}
                        onChange={handleChange}
                        className="edit-status"
                    >
                        <option value="to-do">To Do</option>
                        <option value="doing">Doing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="edit-buttons">
                        <button type="button" onClick={handleSave} className="save-btn">Save</button>
                        <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="task-item">
            <div className="task-content">
                <div className="task-header">
                    <span className="task-title">{task.title}</span>
                    <span 
                        className="task-status"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                        {task.status}
                    </span>
                </div>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
            </div>
            <div className="task-actions">
                <button 
                    className="edit-btn" 
                    onClick={handleEdit}
                >
                    Edit
                </button>
                <button 
                    className="delete-btn" 
                    onClick={() => onDeleteTask(task.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default TaskItem;
