import { useState } from 'react';

const SubtaskForm = ({ onAddSubtask, taskId }) => {
    const [subtaskTitle, setSubtaskTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (subtaskTitle.trim()) {
            onAddSubtask(taskId, { title: subtaskTitle });
            setSubtaskTitle('');
            setIsAdding(false);
        }
    };

    const handleBlur = () => {
        if (subtaskTitle.trim()) {
            onAddSubtask(taskId, { title: subtaskTitle });
            setSubtaskTitle('');
        }
        setIsAdding(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && subtaskTitle.trim()) {
            onAddSubtask(taskId, { title: subtaskTitle });
            setSubtaskTitle('');
            setIsAdding(false);
        } else if (e.key === 'Escape') {
            setSubtaskTitle('');
            setIsAdding(false);
        }
    };

    const startAdding = () => {
        setIsAdding(true);
    };

    if (!isAdding) {
        return (
            <button 
                type="button" 
                className="add-subtask-btn"
                onClick={startAdding}
            >
                + Add Subtask
            </button>
        );
    }

    return (
        <div className="subtask-input-container">
            <input 
                type="text" 
                className="subtask-input" 
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                onBlur={handleBlur}
                onKeyPress={handleKeyPress}
                placeholder="Enter subtask title..."
                autoFocus
            />
        </div>
    );
};

export default SubtaskForm; 