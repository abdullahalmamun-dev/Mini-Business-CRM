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

const getCustomerById = async (req, res, next) => {
  try {
    res.status(200).json({ message: `Get customer ${req.params.id} placeholder` });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Create customer placeholder' });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    res.status(200).json({ message: `Update customer ${req.params.id} placeholder` });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    res.status(200).json({ message: `Delete customer ${req.params.id} placeholder` });
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
