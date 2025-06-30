import { useState } from 'react';

const SubtaskItem = ({ subtask, onDeleteSubtask, onUpdateSubtask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(subtask.title);

    const handleEdit = () => {
        setIsEditing(true);
        setEditTitle(subtask.title);
    };

    const handleSave = () => {
        if (editTitle.trim()) {
            onUpdateSubtask(subtask.id, { title: editTitle });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditTitle(subtask.title);
    };

    const handleChange = (e) => {
        setEditTitle(e.target.value);
    };

    const handleToggleComplete = () => {
        onUpdateSubtask(subtask.id, { completed: !subtask.completed });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && editTitle.trim()) {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="subtask-item editing">
                <div className="subtask-content">
                    <div className="subtask-checkbox-container">
                        <input
                            type="checkbox"
                            checked={subtask.completed}
                            onChange={handleToggleComplete}
                            className="subtask-checkbox"
                        />
                        <input
                            type="text"
                            value={editTitle}
                            onChange={handleChange}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            className="subtask-edit-input"
                            autoFocus
                        />
                    </div>
                </div>
                <div className="subtask-actions">
                    <button 
                        className="delete-btn" 
                        onClick={() => onDeleteSubtask(subtask.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="subtask-item">
            <div className="subtask-content">
                <div className="subtask-checkbox-container">
                    <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={handleToggleComplete}
                        className="subtask-checkbox"
                    />
                    <span 
                        className={`subtask-title ${subtask.completed ? 'completed' : ''}`}
                        onClick={handleEdit}
                    >
                        {subtask.title}
                    </span>
                </div>
            </div>
            <div className="subtask-actions">
                <button 
                    className="delete-btn" 
                    onClick={() => onDeleteSubtask(subtask.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default SubtaskItem; 