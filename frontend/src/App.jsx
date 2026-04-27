import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<div className="glass-panel">Dashboard (Coming Soon)</div>} />
          <Route path="/customers" element={<div className="glass-panel">Customer List (Coming Soon)</div>} />
          <Route path="/customers/:id" element={<div className="glass-panel">Customer Detail (Coming Soon)</div>} />
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager']} />}>
            <Route path="/reports" element={<div className="glass-panel">Reports (Coming Soon)</div>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
