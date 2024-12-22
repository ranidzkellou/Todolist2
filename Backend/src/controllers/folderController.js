import db from "../config/db.js";

function getAllFolders(req, res) {
    const userId = req.currentUser.userId;
    
    console.log("userId",userId);

    const fetch_query = `
        SELECT f.id AS folder_id, f.name AS folder_name, f.emoji AS folder_emoji,
               t.id AS task_id, t.title AS task_title, t.details AS task_details,
               t.deadline, t.created_at, t.updated_at,
               t.status AS task_status,
               t.priority AS task_priority,s.created_at AS subtask_created_at ,
               s.id AS subtask_id, s.title AS subtask_title, s.details AS subtask_details,
               s.deadline AS subtask_deadline, s.status AS subtask_status,
               s.created_at AS subtask_created_at, s.updated_at AS subtask_updated_at,
               c.category_name
        FROM folders f
        LEFT JOIN tasks t ON f.id = t.folder_id
        LEFT JOIN subtasks s ON t.id = s.task_id
        LEFT JOIN tasks_category tc ON t.id = tc.task_id
        LEFT JOIN categories c ON tc.category_id = c.id
        WHERE f.user_id = ?
        ORDER BY f.id, t.id, s.id;
    `;
    
    db.query(fetch_query, [userId], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const groupedData = result.reduce((acc, row) => {
                const {
                    folder_id,
                    folder_name,
                    folder_emoji,
                    task_id,
                    task_title,
                    task_details,
                    task_status,
                    task_priority,
                    deadline,
                    created_at,
                    updated_at,
                    subtask_id,
                    subtask_title,
                    subtask_created_at,
                    subtask_details,
                    subtask_deadline,
                    subtask_status,
                    category_name
                } = row;

                // Find or create folder
                let folder = acc.find(f => f.id === folder_id);
                if (!folder) {
                    folder = {
                        id: folder_id,
                        name: folder_name,
                        emoji: folder_emoji,
                        tasks: []
                    };
                    acc.push(folder);
                }

                // Find or create task
                let task = folder.tasks.find(t => t.id === task_id);
                if (task_id && !task) {
                    task = {
                        priority: task_priority,
                        status: task_status,
                        id: task_id,
                        title: task_title,
                        details: task_details,
                        deadline: deadline,
                        createdAt: created_at,
                        updatedAt: updated_at,
                        categories: [],
                        subtasks: []
                    };
                    folder.tasks.push(task);
                }

                // Add category if it exists and isn't already in the array
                if (task && category_name && !task.categories.includes(category_name)) {
                    task.categories.push(category_name);
                }

                // Add subtask if it exists
                if (task && subtask_id) {
                    const existingSubtask = task.subtasks.find(s => s.id === subtask_id);
                    if (!existingSubtask) {
                        task.subtasks.push({
                            id: subtask_id,
                            title: subtask_title,
                            details: subtask_details,
                            deadline: subtask_deadline,
                            status: subtask_status,
                            createdAt: subtask_created_at,
                        });
                    }
                }

                return acc;
            }, []);

            console.log("groupedData taks",groupedData);

            res.send(groupedData);
        }
    });


}

function createFolder(req, res) {

    const { name, emoji , user_id} = req.body;

    console.log("called",req.body);

    if (!(name && user_id)) {
        return res.status(400).json({ error: "Name and user_id are required" });
    }

    const insert_query = `
        INSERT INTO folders (name, user_id, emoji)
        VALUES (?, ?, ?)
    `;

    db.query(insert_query, [name, user_id, emoji], (err, result) => {
        if (err) {
            console.error("Error creating folder:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Folder created successfully", folderId: result.insertId });
    });
}

function getFolderById(req, res) {
    // Logic to get a folder by ID
}

function updateFolder(req, res) {
    const folderId = req.params.id;
    const { name, emoji } = req.body;

    if (!(name || emoji)) {
        return res.status(400).json({ error: "Name or emoji is required to update" });
    }

    const update_query = `
        UPDATE folders
        SET name = COALESCE(?, name), emoji = COALESCE(?, emoji)
        WHERE id = ?
    `;

    db.query(update_query, [name, emoji, folderId], (err, result) => {
        if (err) {
            console.error("Error updating folder:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json({ message: "Folder updated successfully" });
    });
}

function deleteFolder(req, res) {
    const folderId = req.params.id;

    const delete_tasks_query = `DELETE FROM tasks WHERE folder_id = ?`;
    const delete_subtasks_query = `DELETE FROM subtasks WHERE task_id IN (SELECT id FROM tasks WHERE folder_id = ?)`;
    const delete_folder_query = `DELETE FROM folders WHERE id = ?`;

    db.query(delete_subtasks_query, [folderId], (err) => {
        if (err) {
            console.error("Error deleting subtasks:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    
    // Query to delete all tasks related to the folder
    const delete_tasks_query = `DELETE FROM tasks WHERE folder_id = ?`;
    
    // Query to delete the folder itself

        db.query(delete_tasks_query, [folderId], (err) => {
    // Delete subtasks
            if (err) {
                console.error("Error deleting tasks:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            db.query(delete_folder_query, [folderId], (err) => {
        // Delete tasks
                if (err) {
                    console.error("Error deleting folder:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                res.status(200).json({ message: "Folder and related tasks/subtasks deleted successfully" });
            });
            // Delete folder
        });
    });
}

export {
    getAllFolders,
    createFolder,
    getFolderById,
    updateFolder,
    deleteFolder
};