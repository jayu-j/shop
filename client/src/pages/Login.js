import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // OTP States
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: Request, 2: Verify
  const [otpLoading, setOtpLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      success('Logged in successfully');
      navigate('/');
    } catch (err) {
      error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // OTP Logic
  const handleRequestOTP = (e) => {
    e.preventDefault();
    if (!otpPhone || otpPhone.length < 10) {
      error('Please enter a valid phone number');
      return;
    }
    setOtpLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOtpLoading(false);
      setOtpStep(2);
      success(`OTP sent to ${otpPhone}`);
    }, 1500);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) {
      error('Please enter a valid 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    // Simulate verification
    setTimeout(() => {
      setOtpLoading(false);
      if (otpValue === '123456') {
        setIsOTPModalOpen(false);
        success('Logged in via OTP');
        navigate('/');
        // Note: In real app, this would get a token from backend
      } else {
        error('Invalid OTP. Try 123456');
      }
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to continue shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-actions">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={() => setIsOTPModalOpen(true)}
            style={{ width: '100%' }}
          >
            Login with OTP
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={isOTPModalOpen}
        onClose={() => { setIsOTPModalOpen(false); setOtpStep(1); setOtpValue(''); }}
        title="Login with OTP"
      >
        {otpStep === 1 ? (
          <form onSubmit={handleRequestOTP}>
            <p style={{ marginBottom: '16px', color: 'var(--text-light)' }}>
              Enter your mobile number to receive an OTP.
            </p>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={otpPhone}
                onChange={(e) => setOtpPhone(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn" disabled={otpLoading}>
              {otpLoading ? 'Sending...' : 'Request OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <p style={{ marginBottom: '16px', color: 'var(--text-light)' }}>
              Enter the 6-digit code sent to <b>{otpPhone}</b>
            </p>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="123456"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                maxLength="6"
                style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn" disabled={otpLoading}>
              {otpLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              className="link-btn"
              onClick={() => setOtpStep(1)}
              style={{ display: 'block', margin: '16px auto 0', color: 'var(--primary)' }}
            >
              Change Number
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;
