'use client'; // Required for state and form handling

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './login.css';

type UserType = 'employee' | 'candidate';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  // Auto-select candidate if coming from careers page
  useEffect(() => {
    if (returnUrl?.includes('/recruitment/jobs/careers')) {
      setUserType('candidate');
    }
  }, [returnUrl]);

  // Handle standard Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Replace URL with your actual backend endpoint
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workEmail: email, password, userType }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage for authenticated requests
      localStorage.setItem('token', data.token);

      // Redirect to return URL or home page
      router.push(returnUrl || '/'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = () => {
    // Redirect user to the backend Google Auth route
    window.location.href = 'http://localhost:5000/api/auth/google';
  };
  
  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access your account</p>
        </div>

        {/* Display Error Message if login fails */}
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '10px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>I am a</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setUserType('employee')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: userType === 'employee' ? '2px solid #4f46e5' : '1px solid #d1d5db',
                  backgroundColor: userType === 'employee' ? '#eef2ff' : '#fff',
                  color: userType === 'employee' ? '#4f46e5' : '#374151',
                  fontWeight: userType === 'employee' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setUserType('candidate')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: userType === 'candidate' ? '2px solid #4f46e5' : '1px solid #d1d5db',
                  backgroundColor: userType === 'candidate' ? '#eef2ff' : '#fff',
                  color: userType === 'candidate' ? '#4f46e5' : '#374151',
                  fontWeight: userType === 'candidate' ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Candidate
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={userType === 'employee' ? 'you@company.com' : 'you@email.com'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            className="google-button" 
            onClick={handleGoogleLogin}
          >
            <img 
              src="https://www.svgrepo.com/show/355037/google.svg" 
              alt="Google" 
              className="google-icon" 
            />
            Continue with Google
          </button>

          {userType === 'candidate' && (
            <p className="signup-text">
              Don't have an account? <a href="/register" className="signup-link">Register</a>
            </p>
          )}
        </form>
      </div>
      
      <footer className="copyright">
        © 2024 HR Management System. All rights reserved.
      </footer>
    </div>
  );
}