import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<div>Login (Coming Soon)</div>} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<div className="glass-panel">Dashboard (Coming Soon)</div>} />
        <Route path="/customers" element={<div className="glass-panel">Customer List (Coming Soon)</div>} />
        <Route path="/customers/:id" element={<div className="glass-panel">Customer Detail (Coming Soon)</div>} />
        <Route path="/reports" element={<div className="glass-panel">Reports (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;
