import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(join(__dirname, 'todos.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

// Create tables
function createTables() {
    // Create tasks table
    const tasksSql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'to-do',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Create subtasks table (simplified)
    const subtasksSql = `
        CREATE TABLE IF NOT EXISTS subtasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
        )
    `;
    
    db.run(tasksSql, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err);
        } else {
            console.log('Tasks table ready');
        }
    });
    
    db.run(subtasksSql, (err) => {
        if (err) {
            console.error('Error creating subtasks table:', err);
        } else {
            console.log('Subtasks table ready');
        }
    });
}

// API Routes

// GET all tasks with their subtasks
app.get('/api/tasks', (req, res) => {
    const sql = `
        SELECT 
            t.*,
            json_group_array(
                json_object(
                    'id', s.id,
                    'title', s.title,
                    'completed', s.completed,
                    'created_at', s.created_at
                )
            ) as subtasks
        FROM tasks t
        LEFT JOIN subtasks s ON t.id = s.task_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Parse subtasks JSON and filter out null entries
        const tasksWithSubtasks = rows.map(row => ({
            ...row,
            subtasks: JSON.parse(row.subtasks).filter(subtask => subtask.id !== null)
        }));
        
        res.json(tasksWithSubtasks);
    });
});

// POST new task
app.post('/api/tasks', (req, res) => {
    const { title, description, status } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
    }
    
    const sql = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
    const statusValue = status || 'to-do';
    
    db.run(sql, [title.trim(), description || '', statusValue], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Get the newly created task
        const sql2 = 'SELECT * FROM tasks WHERE id = ?';
        db.get(sql2, [this.lastID], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ ...row, subtasks: [] });
        });
    });
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Task title is required' });
    }
    
    const sql = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?';
    
    db.run(sql, [title.trim(), description || '', status || 'to-do', id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // Get the updated task
        const sql2 = 'SELECT * FROM tasks WHERE id = ?';
        db.get(sql2, [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ ...row, subtasks: [] });
        });
    });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    });
});

// POST new subtask
app.post('/api/tasks/:taskId/subtasks', (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Subtask title is required' });
    }
    
    const sql = 'INSERT INTO subtasks (task_id, title, completed) VALUES (?, ?, 0)';
    
    db.run(sql, [taskId, title.trim()], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Get the newly created subtask
        const sql2 = 'SELECT * FROM subtasks WHERE id = ?';
        db.get(sql2, [this.lastID], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json(row);
        });
    });
});

// PUT update subtask (toggle completion or update title)
app.put('/api/subtasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed, title } = req.body;
    
    let sql, params;
    
    if (title !== undefined) {
        // Update title
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Subtask title is required' });
        }
        sql = 'UPDATE subtasks SET title = ? WHERE id = ?';
        params = [title.trim(), id];
    } else if (completed !== undefined) {
        // Update completion status
        sql = 'UPDATE subtasks SET completed = ? WHERE id = ?';
        params = [completed ? 1 : 0, id];
    } else {
        return res.status(400).json({ error: 'Either title or completed field is required' });
    }
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        
        // Get the updated subtask
        const sql2 = 'SELECT * FROM subtasks WHERE id = ?';
        db.get(sql2, [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(row);
        });
    });
});

// DELETE subtask
app.delete('/api/subtasks/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM subtasks WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Subtask not found' });
        }
        
        res.json({ message: 'Subtask deleted successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 