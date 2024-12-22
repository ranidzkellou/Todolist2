import db from "../config/db.js";

function createTask(req, res) {

    console.log("Creating task:", req.body);

    const { title, details, priority, dueDate, dueTime, categories, emoji, subtasks, folder } = req.body;
    const userId = req.currentUser.userId;

    if (!title || !folder) {
        return res.status(400).json({ error: "Title and folder are required" });
    }

    const date = new Date(`${dueDate}T${dueTime}`);
    const deadline = date.toISOString().slice(0, 19).replace('T', ' ');

    const check_folder_query = `
        SELECT id FROM folders WHERE name = ? AND user_id = ?
    `;

    db.query(check_folder_query, [folder, userId], (err, result) => {
        if (err) {
            console.error("Error checking folder:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Folder not found or does not belong to the user" });
        }

        const folder_id = result[0].id;

        let subtaskIds = [];
        if (subtasks && subtasks.length > 0) {
            const insert_subtasks_query = `
                INSERT INTO subtasks (title, deadlineTime, priority, status)
                VALUES ?
            `;

            const subtaskValues = subtasks.map(subtask => [subtask.title, subtask.deadlineTime, subtask.priority, 'pending']);

            db.query(insert_subtasks_query, [subtaskValues], (err, subtaskResult) => {
                if (err) {
                    console.error("Error creating subtasks:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                const lastInsertId = subtaskResult.insertId;
                for (let i = 0; i < subtasks.length; i++) {
                    subtaskIds.push(lastInsertId + i);
                }

                insertMainTask(subtaskIds, folder_id);
            });
        } else {
            insertMainTask([], folder_id);
        }

        function insertMainTask(subtaskIds = [], folder_id) {
            const insert_task_query = `
                INSERT INTO tasks (title, details, priority, deadline, status, folder_id, emoji)
                VALUES (?, ?, ?, ?, 'pending', ?, ?)
            `;

            db.query(insert_task_query,
                [title, details, priority, deadline, folder_id, emoji],
                (err, result) => {
                    if (err) {
                        console.error("Error creating task:", err);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }

                    const taskId = result.insertId;

                    if (categories && categories.length > 0) {
                        // First get category IDs
                        db.query('SELECT id, category_name FROM categories WHERE category_name IN (?)',
                            [categories],
                            (err, categoryResult) => {
                                if (err) {
                                    console.error("Error getting category IDs:", err);
                                    return res.status(500).json({ error: "Internal Server Error" });
                                }

                                if (categoryResult.length > 0) {
                                    // Prepare values for bulk insert
                                    const categoryValues = categoryResult.map(cat => [taskId, cat.id]);

                                    const insert_categories_query = `
                                        INSERT INTO tasks_category (task_id, category_id)
                                        VALUES ?
                                    `;

                                    db.query(insert_categories_query, [categoryValues], (err) => {
                                        if (err) {
                                            console.error("Error adding categories to task:", err);
                                            return res.status(500).json({ error: "Internal Server Error" });
                                        }
                                        associateSubtasks(taskId, subtaskIds);
                                    });
                                } else {
                                    // No matching categories found, continue with subtasks
                                    associateSubtasks(taskId, subtaskIds);
                                }
                            });
                    } else {
                        associateSubtasks(taskId, subtaskIds);
                    }
                });
        }

        function associateSubtasks(taskId, subtaskIds) {
            if (subtaskIds.length > 0) {
                const update_subtasks_query = `
                    UPDATE subtasks
                    SET task_id = ?
                    WHERE id IN (?)
                `;

                db.query(update_subtasks_query, [taskId, subtaskIds], (err) => {
                    if (err) {
                        console.error("Error associating subtasks with task:", err);
                        return res.status(500).json({ error: "Internal Server Error" });
                    }
                    res.status(201).json({ message: "Task created successfully", taskId: taskId });
                });
            } else {
                res.status(201).json({ message: "Task created successfully", taskId: taskId });
            }
        }
    });
}


function deleteTask(req, res) {
    const { taskId } = req.params;
    const userId = req.currentUser.userId;
    
    console.log("Deleting task:", { taskId, userId });

    const verify_ownership_query = `
        SELECT 
            t.id as task_id,
            t.folder_id,
            f.user_id,
            f.name as folder_name
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE t.id = ? AND f.user_id = ?
        LIMIT 1
    `;

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction start error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Check ownership with logging
        db.query(verify_ownership_query, [taskId, userId], (err, result) => {
            if (err) {
                console.error("Ownership verification error:", err);
                return db.rollback(() => {
                    res.status(500).json({ error: "Internal Server Error" });
                });
            }

            console.log("Ownership verification result:", result);

            if (result.length === 0) {
                console.log("Task not found or unauthorized. TaskID:", taskId, "UserID:", userId);
                return db.rollback(() => {
                    res.status(403).json({ 
                        error: "Task not found or you don't have permission to delete it",
                        details: "Please ensure you own this task"
                    });
                });
            }

            // Proceed with deletion in correct order
            const delete_steps = [
                {
                    query: 'DELETE FROM tasks_category WHERE task_id = ?',
                    message: 'Deleting task categories'
                },
                {
                    query: 'DELETE FROM subtasks WHERE task_id = ?',
                    message: 'Deleting subtasks'
                },
                {
                    query: 'DELETE FROM tasks WHERE id = ? AND folder_id = ?',
                    message: 'Deleting main task',
                    params: [taskId, result[0].folder_id]
                }
            ];

            let currentStep = 0;

            function executeNextStep() {
                if (currentStep >= delete_steps.length) {
                    return db.commit(err => {
                        if (err) {
                            console.error("Commit error:", err);
                            return db.rollback(() => {
                                res.status(500).json({ error: "Internal Server Error" });
                            });
                        }
                        res.status(200).json({ 
                            message: "Task and all related data deleted successfully",
                            taskId: taskId
                        });
                    });
                }

                const step = delete_steps[currentStep];
                console.log(`Executing step ${currentStep + 1}:`, step.message);

                const params = step.params || [taskId];
                db.query(step.query, params, (err, deleteResult) => {
                    if (err) {
                        console.error(`Error in step ${currentStep + 1}:`, err);
                        return db.rollback(() => {
                            res.status(500).json({ error: "Internal Server Error" });
                        });
                    }

                    console.log(`Step ${currentStep + 1} result:`, deleteResult);
                    currentStep++;
                    executeNextStep();
                });
            }

            executeNextStep();
        });
    });
}

function checkTaskStatus(req, res) {

    console.log("Checking task status:", req.params);
    const { taskId } = req.params; 
        const userId = req.currentUser.userId;


    const check_task_query = `
        SELECT id, status FROM tasks WHERE id = ? AND folder_id IN (SELECT id FROM folders WHERE user_id = ?)
    `;

    db.query(check_task_query, [taskId, userId], (err, result) => {
        if (err) {
            console.error("Error checking task:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Task not found or does not belong to the user" });
        }

        const task = result[0];
        const newStatus = task.status === 'pending' ? 'completed' : 'pending'; // Toggle status

        // Update the task status
        const update_task_status_query = `
            UPDATE tasks SET status = ? WHERE id = ?
        `;

        db.query(update_task_status_query, [newStatus, taskId], (err) => {
            if (err) {
                console.error("Error updating task status:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            res.status(200).json({ message: `Task status updated to ${newStatus}` });
        });
    });
}

function updateTask(req, res) {
    
    const { taskId } = req.params;
    const { title, details, priority, dueDate, dueTime, categories, emoji, folder } = req.body;
    const userId = req.currentUser.userId;

    console.log("Updating task:", { taskId, userId, ...req.body });

    const verify_query = `
        SELECT 
            t.id as task_id,
            t.folder_id,
            f.user_id,
            f.name as folder_name
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE t.id = ? AND f.user_id = ?
        LIMIT 1
    `;

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction start error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        db.query(verify_query, [taskId, userId], (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Verification error:", err);
                    res.status(500).json({ error: "Internal Server Error" });
                });
            }

            if (result.length === 0) {
                return db.rollback(() => {
                    res.status(403).json({ error: "Task not found or unauthorized" });
                });
            }

            let newFolderId = result[0].folder_id;

            // If folder is being changed, verify new folder ownership
            const folderUpdatePromise = new Promise((resolve, reject) => {
                if (folder) {
                    db.query('SELECT id FROM folders WHERE name = ? AND user_id = ?', 
                        [folder, userId], 
                        (err, folderResult) => {
                            if (err) reject(err);
                            else if (folderResult.length === 0) {
                                reject(new Error("New folder not found or unauthorized"));
                            } else {
                                newFolderId = folderResult[0].id;
                                resolve();
                            }
                        });
                } else {
                    resolve();
                }
            });

            folderUpdatePromise
                .then(() => {
                    // Update task basic information
                    const update_query = `
                        UPDATE tasks 
                        SET 
                            title = COALESCE(?, title),
                            details = COALESCE(?, details),
                            priority = COALESCE(?, priority),
                            deadline = COALESCE(?, deadline),
                            deadlineTime = COALESCE(?, deadlineTime),
                            emoji = COALESCE(?, emoji),
                            folder_id = ?,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE id = ?
                    `;

                    db.query(update_query, 
                        [title, details, priority, dueDate, dueTime, emoji, newFolderId, taskId],
                        (err, updateResult) => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Task update error:", err);
                                    res.status(500).json({ error: "Error updating task" });
                                });
                            }

                            // Update categories if provided
                            if (categories && Array.isArray(categories)) {
                                // Remove existing categories
                                db.query('DELETE FROM tasks_category WHERE task_id = ?', [taskId], (err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Error removing old categories:", err);
                                            res.status(500).json({ error: "Error updating task categories" });
                                        });
                                    }

                                    // Add new categories
                                    if (categories.length > 0) {
                                        db.query('SELECT id FROM categories WHERE category_name IN (?)', 
                                            [categories], 
                                            (err, categoryResults) => {
                                                if (err) {
                                                    return db.rollback(() => {
                                                        console.error("Error fetching category IDs:", err);
                                                        res.status(500).json({ error: "Error updating task categories" });
                                                    });
                                                }

                                                const categoryValues = categoryResults.map(cat => [taskId, cat.id]);
                                                if (categoryValues.length > 0) {
                                                    db.query('INSERT INTO tasks_category (task_id, category_id) VALUES ?',
                                                        [categoryValues],
                                                        (err) => {
                                                            if (err) {
                                                                return db.rollback(() => {
                                                                    console.error("Error adding new categories:", err);
                                                                    res.status(500).json({ error: "Error updating task categories" });
                                                                });
                                                            }
                                                            commitTransaction();
                                                        });
                                                } else {
                                                    commitTransaction();
                                                }
                                            });
                                    } else {
                                        commitTransaction();
                                    }
                                });
                            } else {
                                commitTransaction();
                            }
                        });
                })
                .catch(err => {
                    db.rollback(() => {
                        console.error("Folder update error:", err);
                        res.status(400).json({ error: err.message });
                    });
                });

            function commitTransaction() {
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Commit error:", err);
                            res.status(500).json({ error: "Error updating task" });
                        });
                    }
                    res.status(200).json({
                        message: "Task updated successfully",
                        taskId: taskId
                    });
                });
            }
        });
    });
}

function getNotifications(req, res) {
    const userId = req.currentUser.userId;

    const fetch_query = `
        SELECT 
            t.id,
            t.title,
            t.deadline,
            t.status,
            t.priority,
            t.emoji,
            f.name as folder_name,
            CASE
                WHEN DATE(t.deadline) = CURDATE() THEN 'today'
                WHEN DATE(t.deadline) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'tomorrow'
                ELSE 'upcoming'
            END as deadline_category,
            DATEDIFF(DATE(t.deadline), CURDATE()) as days_remaining
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE f.user_id = ?
        AND t.status = 'pending'
        AND t.deadline >= CURDATE()
        AND t.deadline <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
        ORDER BY t.deadline ASC, t.priority DESC
        LIMIT 10
    `;

    db.query(fetch_query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Group notifications by deadline category
        const grouped = {
            today: [],
            tomorrow: [],
            upcoming: []
        };

        result.forEach(task => {
            grouped[task.deadline_category].push({
                id: task.id,
                title: task.title,
                deadline: task.deadline,
                priority: task.priority,
                emoji: task.emoji,
                folder: task.folder_name,
                daysRemaining: task.days_remaining
            });
        });

        res.status(200).json({
            notifications: grouped,
            totalCount: result.length
        });
    });
}

function getTasksByCategories(req, res) {
    const userId = req.currentUser.userId;
    
    const fetch_query = `
        SELECT 
            t.id,
            t.title,
            t.details,
            t.deadline,
            t.status,
            t.priority,
            t.emoji,
            f.name as folder_name,
            GROUP_CONCAT(DISTINCT c.category_name) as categories
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        LEFT JOIN tasks_category tc ON t.id = tc.task_id
        LEFT JOIN categories c ON tc.category_id = c.id
        WHERE f.user_id = ?
        GROUP BY t.id
        ORDER BY t.deadline ASC, t.priority DESC
    `;

    db.query(fetch_query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching categorized tasks:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Define all possible categories
        const categoryTitles = [
            "Personal", "Work", "Education", "Health & Fitness",
            "Finance", "Travel", "Home", "Projects", "Non-Categorized"
        ];

        // Initialize categories object with empty arrays
        const categorizedTasks = {};
        categoryTitles.forEach(category => {
            categorizedTasks[category] = [];
        });

        // Process each task
        result.forEach(task => {
            const taskCategories = task.categories ? task.categories.split(',') : [];
            
            // Create task object
            const taskObj = {
                id: task.id,
                title: task.title,
                details: task.details,
                deadline: task.deadline,
                status: task.status,
                priority: task.priority,
                emoji: task.emoji,
                folder: task.folder_name,
                categories: taskCategories
            };

            // If task has no categories, add to Non-Categorized
            if (taskCategories.length === 0) {
                categorizedTasks["Non-Categorized"].push(taskObj);
            } else {
                // Add task to each of its categories
                taskCategories.forEach(category => {
                    if (categoryTitles.includes(category)) {
                        categorizedTasks[category].push(taskObj);
                    }
                });
            }
        });

        // Calculate statistics for each category
        const categoryStats = {};
        categoryTitles.forEach(category => {
            const tasks = categorizedTasks[category];
            categoryStats[category] = {
                total: tasks.length,
                completed: tasks.filter(t => t.status === 'completed').length,
                pending: tasks.filter(t => t.status === 'pending').length,
                overdue: tasks.filter(t => {
                    return t.status === 'pending' && new Date(t.deadline) < new Date();
                }).length
            };
        });

        res.status(200).json({
            categories: categorizedTasks,
            statistics: categoryStats,
            totalTasks: result.length
        });
    });
}

export default {
    createTask,
    deleteTask,
    checkTaskStatus,
    updateTask,
    getNotifications,
    getTasksByCategories
};