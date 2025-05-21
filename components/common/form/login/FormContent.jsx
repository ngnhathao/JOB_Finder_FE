'use client'

import Link from "next/link";
import LoginWithSocial from "../shared/LoginWithSocial";
import { authService } from "@/services/authService";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setLoginState } from '@/features/auth/authSlice';

const FormContent = ({ isPopup = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const closeBtnRef = useRef(null); // Ref cho nút đóng modal

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
      const responseData = await authService.login(formData.email, formData.password);
      
      dispatch(setLoginState({ isLoggedIn: true, user: responseData.name, role: responseData.role }));

      // Kích hoạt nút đóng modal nếu là popup
      if (isPopup && closeBtnRef.current) {
          closeBtnRef.current.click();
      }

      // Chuyển hướng về trang Home sau khi đăng nhập thành công
      router.push('/');

    } catch (error) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to Superio</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* <!--Login Form--> */}
      <form onSubmit={handleSubmit}>
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
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Forgot password?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
        {/* login */}

        {/* Nút ẩn để đóng modal */}
        {isPopup && <button ref={closeBtnRef} data-bs-dismiss="modal" style={{ display: 'none' }}></button>}

{/* Simple Loading Overlay */}
{loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <p>Loading...</p>
          </div>
        )}

      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          {isPopup ? (
            <Link
              href="#"
              className="call-modal signup"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Signup
            </Link>
          ) : (
            <Link href="/register">Signup</Link>
          )}
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
