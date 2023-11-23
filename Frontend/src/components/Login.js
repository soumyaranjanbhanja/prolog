import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const formFields = {
    email: '',
    password: '',
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(formFields);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1400/api/Login', formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('token:', response.data.token);
        console.log('Login successful');
        navigate('/');
      } else {
        setError('Invalid credentials');
      }

      setFormData({
        email: '',
        password: '',
      });
    } catch (error) {
      console.error('Error during login', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={formData.email} name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={formData.password} name="password" onChange={handleChange} required />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
