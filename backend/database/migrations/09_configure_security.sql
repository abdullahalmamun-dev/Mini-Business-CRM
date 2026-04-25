CREATE USER IF NOT EXISTS 'crm_app_user'@'localhost' IDENTIFIED BY 'SecureCrmPass2026!';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'crm_app_user'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE ON mini_crm.* TO 'crm_app_user'@'localhost';

FLUSH PRIVILEGES;
