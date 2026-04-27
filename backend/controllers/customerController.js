const pool = require('../config/db');

const getCustomers = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const status = req.query.status || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM customers c
      LEFT JOIN customer_statuses s ON c.status_id = s.id
      LEFT JOIN users u ON c.assigned_staff_id = u.id
      WHERE 1=1
    `;
    let queryParams = [];

    if (req.user.role === 'Staff') {
      baseQuery += ` AND c.assigned_staff_id = ?`;
      queryParams.push(req.user.id);
    }

    if (status) {
      baseQuery += ` AND s.name = ?`;
      queryParams.push(status);
    }

    if (search) {
      baseQuery += ` AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)`;
      const searchVal = `%${search}%`;
      queryParams.push(searchVal, searchVal, searchVal);
    }
    
    const [countResult] = await pool.query(`SELECT COUNT(c.id) as total ${baseQuery}`, queryParams);
    const total = countResult[0].total;

    let dataQuery = `
      SELECT 
        c.*, 
        s.name as status_name, 
        u.name as assigned_staff_name 
      ${baseQuery}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);

    const [customers] = await pool.query(dataQuery, queryParams);
    
    res.status(200).json({
      data: customers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const { validationResult } = require('express-validator');

const getCustomerById = async (req, res, next) => {
  try {
    const [customers] = await pool.query(`
      SELECT c.*, s.name as status_name, u.name as assigned_staff_name 
      FROM customers c
      LEFT JOIN customer_statuses s ON c.status_id = s.id
      LEFT JOIN users u ON c.assigned_staff_id = u.id
      WHERE c.id = ?
    `, [req.params.id]);

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customer = customers[0];

    // RBAC: Staff can only view their own customers
    if (req.user.role === 'Staff' && customer.assigned_staff_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You do not own this record.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, company, status_id, assigned_staff_id } = req.body;

    // Default status to 'New' (1) if not provided
    const finalStatusId = status_id || 1;
    
    // Default assignment: If Staff, assign to self. If Admin/Manager, assign as requested or null.
    const finalStaffId = req.user.role === 'Staff' ? req.user.id : (assigned_staff_id || null);

    const [result] = await pool.query(
      `INSERT INTO customers (name, email, phone, company, status_id, assigned_staff_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, company || null, finalStatusId, finalStaffId]
    );

    res.status(201).json({ 
      message: 'Customer created successfully',
      customerId: result.insertId 
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, company, status_id, assigned_staff_id } = req.body;
    
    // Check if customer exists and verify ownership for Staff
    const [existing] = await pool.query('SELECT assigned_staff_id FROM customers WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (req.user.role === 'Staff' && existing[0].assigned_staff_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You do not own this record.' });
    }

    await pool.query(
      `UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, status_id = ?, assigned_staff_id = ? WHERE id = ?`,
      [name, email, phone, company, status_id, assigned_staff_id, req.params.id]
    );

    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
