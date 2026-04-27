const pool = require('../config/db');
const { validationResult } = require('express-validator');
const { logActivity } = require('../utils/activityLogger');

const getTasks = async (req, res, next) => {
  try {
    let query = `
      SELECT t.*, c.name as customer_name 
      FROM tasks t 
      JOIN customers c ON t.customer_id = c.id
    `;
    let queryParams = [];

    if (req.user.role === 'Staff') {
      query += ` WHERE t.assigned_staff_id = ?`;
      queryParams.push(req.user.id);
    }

    const [tasks] = await pool.query(query + ' ORDER BY t.due_date ASC', queryParams);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTasksByCustomer = async (req, res, next) => {
  try {
    const [tasks] = await pool.query(
      'SELECT * FROM tasks WHERE customer_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { task_type, priority, notes, due_date, assigned_staff_id } = req.body;
    const customer_id = req.params.id;

    const status = 'Pending';
    const staff_id = assigned_staff_id || req.user.id;

    const [result] = await pool.query(
      `INSERT INTO tasks (customer_id, assigned_staff_id, task_type, priority, status, notes, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, staff_id, task_type, priority, status, notes, due_date]
    );

    await logActivity(customer_id, req.user.id, 'Task Created', `New task: ${task_type}`);

    res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { status, priority, assigned_staff_id, notes, due_date } = req.body;
    const taskId = req.params.taskId;

    const [existing] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = existing[0];
    let completed_date = task.completed_date;

    if (status === 'Completed' && task.status !== 'Completed') {
      completed_date = new Date().toISOString().slice(0, 10); 
      await logActivity(task.customer_id, req.user.id, 'Task Completed', `Task ${task.task_type} marked as completed`);
    }

    await pool.query(
      `UPDATE tasks SET status = ?, priority = ?, assigned_staff_id = ?, notes = ?, due_date = ?, completed_date = ? WHERE id = ?`,
      [
        status || task.status, 
        priority || task.priority, 
        assigned_staff_id || task.assigned_staff_id, 
        notes || task.notes, 
        due_date || task.due_date, 
        completed_date,
        taskId
      ]
    );

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.taskId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTasksByCustomer,
  createTask,
  updateTask,
  deleteTask
};
