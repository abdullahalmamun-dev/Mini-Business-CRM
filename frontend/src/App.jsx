import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
