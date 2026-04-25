# Mini Business CRM

A small web application where users can manage customers, assign tasks, track activities, and view reports. Built with React, Node.js, Express, and MySQL.

## Project Structure

- `/frontend` - React application (to be initialized)
- `/backend` - Node.js and Express API

## Initial Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- MySQL Server

### Database Setup

1. Ensure your MySQL server is running.
2. Create a new database named `mini_crm`:
   ```sql
   CREATE DATABASE mini_crm;
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Update the `.env` file in the `backend` directory with your database credentials:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=mini_crm
     DB_PORT=3306
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The API should be running at `http://localhost:5000`.

### Frontend Setup

*(Instructions to be added once the frontend application is initialized)*
