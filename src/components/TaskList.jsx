import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDeleteTask }) => {
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
                />
            ))}
        </div>
    );
}

export default TaskList;
