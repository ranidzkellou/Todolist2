import express, { json } from 'express';
import { config } from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import verifyToken from './src/middleware/verifyToken.js';

import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import folderRoutes from './src/routes/folderRoutes.js';
import subtaskRoutes from './src/routes/subtaskRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import userRoutes from './src/routes/userRoutes.js'

config();

const app = express();

app.use(json());
app.use(cors());
app.use(bodyParser.json());


app.use('/api/auth', authRoutes);
app.use('/api/user', verifyToken, userRoutes);
app.use('/api/tasks', verifyToken, taskRoutes);
app.use('/api/folders', verifyToken, folderRoutes);
app.use('/api/subtasks', verifyToken, subtaskRoutes);
app.use('/api/dashboard', verifyToken, dashboardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
