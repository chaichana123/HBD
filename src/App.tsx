
import './App.css'

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./page/Home";
import Users from "./page/Users";
import UserDetail from './page/UserDetail';
import UserForm from './page/UserForm';

function App() {
  return (
    <>
      <BrowserRouter>
      {/* เมนูนำทาง */}
      <div style={{ display: "flex", gap: 12, padding: 24 }}>
        <Link to="/">Home</Link>
        <Link to="/users">Users</Link>
      </div>

      {/* จุดเปลี่ยนหน้า */}
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/users/new" element={<UserForm mode="create" />} />
        <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
