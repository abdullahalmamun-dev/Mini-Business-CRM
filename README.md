# Mini Business CRM 🚀

A professional, high-performance CRM system designed for small businesses to manage customer relationships, team tasks, and real-time analytics. Built with a modern **React (Vite) + Node.js (Express) + MySQL** stack.

---

## ✨ Key Features
- **Dashboard & Analytics**: Real-time charts for customer growth, task priority, and staff performance.
- **Customer Management**: Full CRUD with advanced filtering, CSV Export, and Bulk CSV Import.
- **Activity Timeline**: Visual history of every interaction, status change, and task completion.
- **Task System**: Robust task tracking with priority badges and automated audit logging.
- **Security**: Role-Based Access Control (RBAC) for Admin, Manager, and Staff roles using JWT.
- **Enterprise Ready**: Complete Audit Log system tracking all data modifications.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher.
- **MySQL**: v8.0 or higher.
- **npm**: v9.0.0 or higher.

### 2. Database Configuration
1. Start your local MySQL server.
2. Create the database:
   ```sql
   CREATE DATABASE mini_crm;
   ```

### 3. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (`backend/.env`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=mini_crm
   JWT_SECRET=super_secret_key_123
   ```
4. **Run Migrations & Seed Data**:
   ```bash
   node run_migrations.js
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 🔑 Test Credentials
Use the following accounts to evaluate role-based permissions:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@crm.com` | `password123` | Full Access + User Management |
| **Manager** | `manager@crm.com` | `password123` | Reports + Customer/Task Management |
| **Staff** | `staff1@crm.com` | `password123` | Assigned Customers + Personal Tasks |


---

## ✅ Deployment Checklist
- [x] JWT Secret configured
- [x] Database indexes applied for performance
- [x] Audit logging enabled for all mutations
- [x] RBAC middleware enforced on all routes
