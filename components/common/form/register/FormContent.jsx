'use client'

import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

const FormContent = ({ role }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData.email, formData.password, role);
      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      router.push('/login');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label>Email Address</label>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* email */}

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      {/* password */}

      <div className="form-group">
        <button 
          className="theme-btn btn-style-one" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
      {/* register button */}
    </form>
  );
};

export default FormContent;
