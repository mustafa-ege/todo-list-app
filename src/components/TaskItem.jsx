const TaskItem = ({ task, onDeleteTask }) => {
    return (
        <div className="task-item">
            <span className="task-title">{task.title}</span>
            <button 
                className="delete-btn" 
                onClick={() => onDeleteTask(task.id)}
            >
                Delete
            </button>
        </div>
    );
}

export default TaskItem;
