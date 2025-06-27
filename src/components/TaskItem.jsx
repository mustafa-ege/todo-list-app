const TaskItem = ({ task, onDeleteTask }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'to-do': return '#ff9800';
            case 'doing': return '#2196f3';
            case 'completed': return '#4caf50';
            case 'cancelled': return '#f44336';
            default: return '#666';
        }
    };
    
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
