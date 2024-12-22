import db from "../config/db.js";
function getTodayData(req, res) {
    const userId = req.currentUser.userId;
    console.log("userId", userId);

    const fetch_query = `
        SELECT 
            t.id,
            t.title,
            t.details,
            t.deadline,
            t.deadlineTime,
            t.priority,
            t.status,
            t.emoji,
            t.created_at,
            t.updated_at,
            f.name as folder_name
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE t.deadline = CURDATE()
        AND f.user_id = ?
        ORDER BY t.deadlineTime ASC;
    `;

    db.query(fetch_query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching tasks:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const tasks = result.map(task => ({
            id: task.id,
            title: task.title,
            details: task.details,
            deadline: task.deadline,
            deadlineTime: task.deadlineTime,
            priority: task.priority,
            status: task.status,
            emoji: task.emoji,
            createdAt: task.created_at,
            updatedAt: task.updated_at,
            folder: task.folder_name
        }));

        console.log("tasks", tasks);
        res.status(200).json(tasks);
    });
}

function getMonthData(req, res) {
    const userId = req.currentUser.userId;

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    const fetch_query = `
        SELECT 
            t.id,
            DATE_FORMAT(t.deadline, '%Y-%m-%d') as deadline_date,
            t.status,
            t.priority
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE f.user_id = ?
        AND DATE(t.deadline) BETWEEN ? AND ?
    `;

    const mysqlFirstDay = firstDayOfMonth.toISOString().slice(0, 10);
    const mysqlLastDay = lastDayOfMonth.toISOString().slice(0, 10);

    db.query(fetch_query, [userId, mysqlFirstDay, mysqlLastDay], (err, result) => {
        if (err) {
            console.error("Error fetching monthly tasks:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // Process all tasks
        const allTasks = result || [];
        const monthSummary = {
            totalTasks: allTasks.length,
            completedTasks: allTasks.filter(t => t.status === 'completed').length,
            missedTasks: allTasks.filter(t => t.status === 'missed').length,
            pendingTasks: allTasks.filter(t => t.status === 'pending').length
        };

        const daysArray = Array.from({ length: totalDays }, (_, index) => {
            const currentDay = index +2;
            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDay);
            const dateString = currentDayDate.toISOString().slice(0, 10);

            const tasksForDay = allTasks.filter(task => task.deadline_date === dateString);

            const dayStats = {
                totalTasks: tasksForDay.length,
                completed: tasksForDay.filter(t => t.status === 'completed').length,
                missed: tasksForDay.filter(t => t.status === 'missed').length,
                pending: tasksForDay.filter(t => t.status === 'pending').length,
                priorities: {
                    high: {
                        total: tasksForDay.filter(t => t.priority === 'High').length,
                        completed: tasksForDay.filter(t => t.priority === 'High' && t.status === 'completed').length,
                        completion: 0
                    },
                    medium: {
                        total: tasksForDay.filter(t => t.priority === 'Medium').length,
                        completed: tasksForDay.filter(t => t.priority === 'Medium' && t.status === 'completed').length,
                        completion: 0
                    },
                    low: {
                        total: tasksForDay.filter(t => t.priority === 'Low').length,
                        completed: tasksForDay.filter(t => t.priority === 'Low' && t.status === 'completed').length,
                        completion: 0
                    }
                }
            };

            ['high', 'medium', 'low'].forEach(priority => {
                const stats = dayStats.priorities[priority];
                stats.completion = stats.total > 0 
                    ? ((stats.completed / stats.total) * 100).toFixed(1)
                    : 0;
            });

            return {
                day: currentDay -1 ,
                date: dateString,
                isToday: currentDay === currentDate.getDate(),
                statistics: dayStats
            };
        });

        res.status(200).json({
            monthSummary,
            days: daysArray
        });
    });
}

function getStats(req, res) {
    const userId = req.currentUser.userId;

    const fetch_query = `
        SELECT
            COUNT(DISTINCT t.id) as total_tasks,
            SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN t.status != 'completed' THEN 1 ELSE 0 END) as remaining_tasks,
            SUM(CASE WHEN t.status != 'completed' AND t.deadline < CURDATE() THEN 1 ELSE 0 END) as overdue_tasks
        FROM tasks t
        INNER JOIN folders f ON t.folder_id = f.id
        WHERE f.user_id = ?
    `;

    db.query(fetch_query, [userId], (err, result) => {
        if (err) {
            console.error("Error fetching statistics:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json(result[0]);
    });
}

export  {
    getTodayData,
    getMonthData,
    getStats
};