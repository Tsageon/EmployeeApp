import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './components/App2';
import Register from './components/register';
import Login from './components/login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/app2" element={<Form />} />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;