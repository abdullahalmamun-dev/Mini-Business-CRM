CREATE TABLE IF NOT EXISTS customer_statuses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO customer_statuses (name) VALUES 
    ('New'), 
    ('Contacted'), 
    ('Qualified'), 
    ('Proposal Sent'), 
    ('Won'), 
    ('Lost')
ON DUPLICATE KEY UPDATE name=VALUES(name);
