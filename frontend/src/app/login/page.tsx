// // 
// // frontend/src/app/login/page.tsx
// import './login.css';

// export default function LoginPage() {
//   return (
//     <div className="login-page-wrapper">
//       <div className="login-card">
//         <div className="login-header">
//           <h1>Welcome Back</h1>
//           <p>Sign in to access your account</p>
//         </div>

//         <form>
//           <div className="form-group">
//             <label htmlFor="email">Email Address</label>
//             <input 
//               type="email" 
//               id="email" 
//               placeholder="you@company.com" 
//               required 
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input 
//               type="password" 
//               id="password" 
//               placeholder="••••••••" 
//               required 
//             />
//           </div>

//           <div className="form-options">
//             <label className="remember-me">
//               <input type="checkbox" />
//               <span>Remember me</span>
//             </label>
//             <a href="#" className="forgot-password">Forgot password?</a>
//           </div>

//           <button type="submit" className="signin-button">
//             Sign In
//           </button>

//           <div className="divider">
//             <span>or</span>
//           </div>

//           <button type="button" className="google-button">
//             <img 
//               src="https://www.svgrepo.com/show/355037/google.svg" 
//               alt="Google" 
//               className="google-icon" 
//             />
//             Continue with Google
//           </button>

//           <p className="signup-text">
//             Don't have an account? <a href="#" className="signup-link">Sign up</a>
//           </p>
//         </form>
//       </div>
      
//       <footer className="copyright">
//         © 2024 HR Management System. All rights reserved.
//       </footer>
//     </div>
//   );
// }
'use client'; // Required for state and form handling

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        body: JSON.stringify({ workEmail: email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage for authenticated requests
      localStorage.setItem('token', data.token);

      // Redirect to your main dashboard/home page
      router.push('/dashboard'); 
      
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
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com" 
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

          <p className="signup-text">
            Don't have an account? <a href="#" className="signup-link">Sign up</a>
          </p>
        </form>
      </div>
      
      <footer className="copyright">
        © 2024 HR Management System. All rights reserved.
      </footer>
    </div>
  );
}