-- Optimize Performance with Strategic Indexes
CREATE INDEX idx_customers_status ON customers(status_id);
CREATE INDEX idx_customers_staff ON customers(assigned_staff_id);
CREATE INDEX idx_customers_created ON customers(created_at);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
