import db from "../config/db.js";
function createSubtask(req, res) {
    const { title, priority, deadline, taskId } = req.body; 
    const userId = req.currentUser.userId;
    console.log("req", req.body);

    let fullDeadline = deadline;
    if (deadline && !deadline.includes('-')) {
        const currentDate = new Date();
        const dateStr = currentDate.toISOString().split('T')[0]; 
        fullDeadline = `${dateStr} ${deadline}:00`; 
    }

    if (!title || !taskId) {
        return res.status(400).json({ error: "Title and taskId are required" });
    }

    const check_task_query = `
        SELECT id FROM tasks WHERE id = ? AND folder_id IN (SELECT id FROM folders WHERE user_id = ?)
    `;

    db.query(check_task_query, [taskId, userId], (err, result) => {
        if (err) {
            console.error("Error checking task:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Task not found or does not belong to the user" });
        }

        const insert_subtask_query = `
            INSERT INTO subtasks (title, priority, deadline, task_id)
            VALUES (?, ?, ?, ?)
        `;

        db.query(insert_subtask_query, [title, priority, fullDeadline, taskId], (err, result) => {
            if (err) {
                console.error("Error creating subtask:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.status(201).json({ message: "Subtask created successfully", subtaskId: result.insertId });
        });
    });
}




function updateSubtask(req, res) {
    const subtaskId = req.params.id;
    const { title, details, deadline, priority, status } = req.body;
    const userId = req.currentUser.userId; 

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const update_subtask_query = `
        UPDATE subtasks
        SET title = ?, details = ?, deadline = ?, priority = ?, status = ?
        WHERE id = ? AND task_id IN (SELECT id FROM tasks WHERE folder_id IN (SELECT id FROM folders WHERE user_id = ?))
    `;

    db.query(update_subtask_query, [title, details, deadline, priority, status, subtaskId, userId], (err, result) => {
        if (err) {
            console.error("Error updating subtask:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Subtask not found or does not belong to the user" });
        }

        res.status(200).json({ message: "Subtask updated successfully" });
    });
}

function deleteSubtask(req, res) {
    const subtaskId = req.params.id;
    const userId = req.currentUser.userId; 

    const delete_subtask_query = `
        DELETE FROM subtasks
        WHERE id = ? AND task_id IN (SELECT id FROM tasks WHERE folder_id IN (SELECT id FROM folders WHERE user_id = ?))
    `;

    db.query(delete_subtask_query, [subtaskId, userId], (err, result) => {
        if (err) {
            console.error("Error deleting subtask:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Subtask not found or does not belong to the user" });
        }

        res.status(200).json({ message: "Subtask deleted successfully" });
    });
}

function checkSubTaskStatus(req, res) {
    const { subtaskId } = req.params;
    const userId = req.currentUser.userId;

    console.log("Checking subtask status:", { subtaskId, userId });

    const check_subtask_query = `
        SELECT 
            s.id,
            s.status,
            t.id as task_id
        FROM subtasks s
        INNER JOIN tasks t ON s.task_id = t.id
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE s.id = ? AND f.user_id = ?
        LIMIT 1
    `;

    db.query(check_subtask_query, [subtaskId, userId], (err, result) => {
        if (err) {
            console.error("Error checking subtask:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ 
                error: "Subtask not found or you don't have permission to modify it" 
            });
        }

        const subtask = result[0];
        const newStatus = subtask.status === 'pending' ? 'completed' : 'pending';

        const update_status_query = `
            UPDATE subtasks 
            SET 
                status = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        db.query(update_status_query, [newStatus, subtaskId], (err) => {
            if (err) {
                console.error("Error updating subtask status:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.status(200).json({ 
                message: `Subtask status updated to ${newStatus}`,
                subtaskId: subtaskId,
                taskId: subtask.task_id,
                status: newStatus
            });
        });
    });
}

export default {
    createSubtask,
    updateSubtask,
    deleteSubtask,
    checkSubTaskStatus
};
