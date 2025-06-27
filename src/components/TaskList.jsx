import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDeleteTask, onUpdateTask }) => {
    if (tasks.length === 0) {
        return <div className="no-tasks">No tasks yet.</div>;
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    onDeleteTask={onDeleteTask}
                    onUpdateTask={onUpdateTask}
                />
            ))}
        </div>
    );
}

export default TaskList;
