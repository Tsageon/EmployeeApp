import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = credentials.email ? "" : "Email is required.";
    tempErrors.password = credentials.password ? "" : "Password is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const users = JSON.parse(localStorage.getItem('Users')) || [];
    const foundUser = users.find(user => user.email === credentials.email && user.password === credentials.password);

    if (foundUser) {
      setLoginStatus('Login successful!');
      navigate('/app2');
    } else {
      setLoginStatus('Invalid email or password.');
    }
  };
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={credentials.email} 
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} 
        />
        <div className="error">{errors.email}</div>

        <input 
          type="password" 
          placeholder="Password" 
          value={credentials.password} 
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
        />
        <div className="error">{errors.password}</div>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <i><b><Link className='link' to="/">Register</Link></b></i>
      </p>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
}

export default Login;
