import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Chatbot from './Chatbot';

const Signup = () => {
  const formFields = {
    email: '',
    password: '',
  };
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(formFields);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1400/api/Signup', {
        email: formData.email,
        password: formData.password, 
      });

      if (response.data && response.data.message === 'Signup successful') {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        navigate('/Login');
        console.log('Signup successful', response.data.token);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('User already in use');
      } else {
        setError('Signup failed. Try again later.');
      }
      console.error('Could not signup', error);
    }
  };

  return (
    <div className="form-container">
      <form className="form-group">
        <div className="signup-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="signup-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={handleSubmit}>Signup</button>
      </form>
      <Chatbot/>
    </div>
  );
};

export default Signup;
