import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Register.css';

function Register() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [registerStatus, setRegisterStatus] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = user.email ? "" : "Email is required.";
    tempErrors.password = user.password ? "" : "Password is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem('Users')) || [];
    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
      setRegisterStatus('Email already registered.');
      Swal.fire({
        title: 'No!',
        text: 'Credentials already in Use!',
        icon: 'error',
        confirmButtonText: 'Proceed'
      })
    } else {
      users.push(user);
      localStorage.setItem('Users', JSON.stringify(users));
      setRegisterStatus('Registration successful! You can now log in.');
      Swal.fire({
        title:'Registered successfully',
        text: 'Great! Click the button',
        icon: 'success',
        confirmButtonText:'Okay!'
      })
      navigate('/login'); 
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={user.email} 
          onChange={(e) => setUser({ ...user, email: e.target.value })} 
        />
        <div className="error">{errors.email}</div>

        <input 
          type="password" 
          placeholder="Password" 
          value={user.password} 
          onChange={(e) => setUser({ ...user, password: e.target.value })} 
        />
        <div className="error">{errors.password}</div>

        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <i><b><Link className='link' to="/login">Login</Link></b></i>
      </p>
      {registerStatus && <p>{registerStatus}</p>}
    </div>
  );
}

export default Register;
