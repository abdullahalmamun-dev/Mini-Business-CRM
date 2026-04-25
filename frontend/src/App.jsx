import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard (Coming Soon)</div>} />
      <Route path="/login" element={<div>Login (Coming Soon)</div>} />
      <Route path="/customers" element={<div>Customer List (Coming Soon)</div>} />
      <Route path="/customers/:id" element={<div>Customer Detail (Coming Soon)</div>} />
      <Route path="/reports" element={<div>Reports (Coming Soon)</div>} />
    </Routes>
  );
}

export default App;
