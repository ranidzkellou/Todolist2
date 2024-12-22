import db from "../config/db.js";
import bcrypt from 'bcrypt';
import { verifyHashedData } from '../util/hashData.js';

function updatePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const currentPassword =oldPassword;
    const userId = req.currentUser.userId;
    console.log("called", req.body);

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
            error: "Current password and new password are required" 
        });
    }

    const cleanCurrentPassword = currentPassword.trim();
    const cleanNewPassword = newPassword.trim();

    if (cleanCurrentPassword.length < 1 || cleanNewPassword.length < 1) {
        return res.status(400).json({ 
            error: "Passwords cannot be empty" 
        });
    }

    db.query('SELECT password FROM users WHERE id = ?', [userId], (err, users) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Error updating password" });
        }

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = users[0].password;
        if (!hashedPassword) {
            console.error("Stored password hash is missing");
            return res.status(500).json({ error: "Error updating password" });
        }

        verifyHashedData(cleanCurrentPassword, hashedPassword)
            .then(passwordMatch => {
                if (!passwordMatch) {
                    return res.status(401).json({ error: "Current password is incorrect" });
                }

                bcrypt.hash(cleanNewPassword, 10, (err, hashedNewPassword) => {
                    if (err) {
                        console.error("Error hashing password:", err);
                        return res.status(500).json({ error: "Error updating password" });
                    }

                    db.query('UPDATE users SET password = ? WHERE id = ?', 
                        [hashedNewPassword, userId], 
                        (err) => {
                            if (err) {
                                console.error("Error updating password:", err);
                                return res.status(500).json({ error: "Error updating password" });
                            }
                            res.status(200).json({ message: "Password updated successfully" });
                        });
                });
            })
            .catch(err => {
                console.error("Error verifying password:", err);
                res.status(500).json({ error: "Error verifying current password" });
            });
    });
}

function deleteAccount(req, res) {
    const userId = req.currentUser.userId;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json({ error: "Error deleting account" });
        }

        db.query(`
            DELETE st FROM subtasks st
            INNER JOIN tasks t ON st.task_id = t.id
            INNER JOIN folders f ON t.folder_id = f.id
            WHERE f.user_id = ?
        `, [userId], (err) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Error deleting subtasks:", err);
                    res.status(500).json({ error: "Error deleting account" });
                });
            }

            db.query(`
                DELETE t FROM tasks t
                INNER JOIN folders f ON t.folder_id = f.id
                WHERE f.user_id = ?
            `, [userId], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Error deleting tasks:", err);
                        res.status(500).json({ error: "Error deleting account" });
                    });
                }

                // Delete folders
                db.query('DELETE FROM folders WHERE user_id = ?', [userId], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error deleting folders:", err);
                            res.status(500).json({ error: "Error deleting account" });
                        });
                    }

                    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Error deleting user:", err);
                                res.status(500).json({ error: "Error deleting account" });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    console.error("Error committing transaction:", err);
                                    res.status(500).json({ error: "Error deleting account" });
                                });
                            }
                            res.status(200).json({ message: "Account and all associated data deleted successfully" });
                        });
                    });
                });
            });
        });
    });
}

function getUserInfo(req, res) {
    const userId = req.currentUser.userId;

    db.query(
        'SELECT id, username, email, created_at, first_name , last_name FROM users WHERE id = ?', 
        [userId],
        (err, users) => {
            if (err) {
                console.error("Error fetching user info:", err);
                return res.status(500).json({ error: "Error fetching user information" });
            }

            if (users.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            res.status(200).json({ user: users[0] });
        }
    );
}

function updateUserInfo(req, res) {
    console.log("updateUserInfo called ", req.body);

    const userId = req.currentUser.userId;
    const { first_name, last_name, username, email } = req.body;

    console.log("Validating email:", email);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    console.log(emailRegex.test("raneeieee@gmail.com"));


    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    console.log("Updating user with:", { first_name, last_name, username, email });

    db.query(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username, email, userId],
        (err, results) => {
            if (err) {
                console.error("Error checking existing users:", err);
                return res.status(500).json({ error: "Error checking user existence" });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: "Username or email already exists" });
            }

            console.log("Proceeding to update user with ID:", userId);

            const sqlQuery = `
                UPDATE users 
                SET 
                    first_name = COALESCE(?, first_name),
                    last_name = COALESCE(?, last_name),
                    username = COALESCE(?, username),
                    email = COALESCE(?, email),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`;

            console.log("SQL Query:", sqlQuery);

            db.query(
                sqlQuery,
                [first_name, last_name, username, email, userId],
                (err, result) => {
                    if (err) {
                        console.error("Error updating user:", err);
                        return res.status(500).json({ error: "Error updating user information" });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ error: "User not found" });
                    }

                    console.log("Update successful:", result);
                    res.status(200).json({
                        message: "User information updated successfully",
                    });
                }
            );
        }
    );
}

export default {
    updatePassword,
    deleteAccount,
    getUserInfo,
    updateUserInfo
};
