'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login/login.css';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [city, setCity] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/auth/register/candidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          middleName: middleName || undefined,
          lastName,
          personalEmail: email,
          password,
          nationalId,
          mobilePhone: mobilePhone || undefined,
          homePhone: homePhone || undefined,
          gender: gender || undefined,
          maritalStatus: maritalStatus || undefined,
          dateOfBirth: dateOfBirth || undefined,
          address: (city || streetAddress || country) ? {
            city: city || undefined,
            streetAddress: streetAddress || undefined,
            country: country || undefined,
          } : undefined,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to home or careers page
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Register as a candidate to apply for jobs</p>
        </div>

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
          {/* Name Fields */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nationalId">National ID *</label>
            <input
              type="text"
              id="nationalId"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter your national ID"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            />
          </div>

          {/* Demographics */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                  backgroundColor: 'white',
                }}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="maritalStatus">Marital Status</label>
              <select
                id="maritalStatus"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                  backgroundColor: 'white',
                }}
              >
                <option value="">Select Status</option>
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="DIVORCED">Divorced</option>
                <option value="WIDOWED">Widowed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            />
          </div>

          {/* Contact Information */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mobilePhone">Mobile Phone</label>
              <input
                type="tel"
                id="mobilePhone"
                value={mobilePhone}
                onChange={(e) => setMobilePhone(e.target.value)}
                placeholder="+1 234 567 8900"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="homePhone">Home Phone</label>
              <input
                type="tel"
                id="homePhone"
                value={homePhone}
                onChange={(e) => setHomePhone(e.target.value)}
                placeholder="+1 234 567 8900"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '15px',
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="streetAddress">Street Address</label>
            <input
              type="text"
              id="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="123 Main St"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            />
          </div>

          {/* Password Fields */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="signup-text">
            Already have an account? <a href="/login" className="signup-link">Sign in</a>
          </p>
        </form>
      </div>

      <footer className="copyright">
        © 2024 HR Management System. All rights reserved.
      </footer>
    </div>
  );
}
