const pool = require('../config/db');

const logAudit = async (userId, action, entityType, entityId, details = {}) => {
  try {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [userId, action, entityType, entityId, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('[Audit Log Error]:', error);
  }
};

module.exports = { logAudit };
