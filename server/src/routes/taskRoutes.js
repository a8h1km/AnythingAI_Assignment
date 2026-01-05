// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

// Apply verifyToken to ALL routes in this file automatically
router.use(verifyToken);

// GET /api/tasks - Get tasks (Admin sees all, User sees own)
router.get('/', taskController.getAllTasks);

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;