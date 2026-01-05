// src/controllers/taskController.js
const Task = require('../models/Task');

// 1. Create a Task
exports.createTask = async (req, res) => {
    try {
        const { title, status } = req.body;
        // req.userId comes from the verifyToken middleware
        const task = await Task.create({
            title,
            status,
            userId: req.userId
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get All Tasks (RBAC Logic)
exports.getAllTasks = async (req, res) => {
    try {
        let tasks;
        // If Admin: Fetch ALL tasks
        if (req.userRole === 'admin') {
            tasks = await Task.findAll();
        }
        // If User: Fetch ONLY their own tasks
        else {
            tasks = await Task.findAll({ where: { userId: req.userId } });
        }
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Delete Task (RBAC Logic)
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        // Allow delete if: User is Admin OR User owns the task
        if (req.userRole === 'admin' || task.userId === req.userId) {
            await task.destroy();
            res.status(200).json({ message: "Task deleted successfully" });
        } else {
            res.status(403).json({ message: "Access denied. You do not own this task." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update Task (RBAC Logic)
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;
        const task = await Task.findByPk(id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        // Allow update if: User is Admin OR User owns the task
        if (req.userRole === 'admin' || task.userId === req.userId) {
            await task.update({ title, status });
            res.status(200).json(task);
        } else {
            res.status(403).json({ message: "Access denied. You do not own this task." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};