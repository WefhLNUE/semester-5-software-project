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
  const [resumeUrl, setResumeUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Compliance consent states
  const [gdprConsent, setGdprConsent] = useState(false);
  const [talentPoolConsent, setTalentPoolConsent] = useState(false);
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
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

    // Validate compliance consents
    if (!gdprConsent) {
      setError('You must agree to GDPR and data protection terms to continue');
      return;
    }

    if (!dataProcessingConsent) {
      setError('You must consent to data processing for recruitment purposes');
      return;
    }

    if (!talentPoolConsent) {
      setError('You must authorize talent pool storage to continue');
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
          resumeUrl: resumeUrl || undefined,
          // GDPR Compliance
          gdprConsent,
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

          {/* Resume URL */}
          <div className="form-group">
            <label htmlFor="resumeUrl">Resume URL</label>
            <input
              type="url"
              id="resumeUrl"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://drive.google.com/your-resume or LinkedIn profile"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '15px',
              }}
            />
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
            }}>
              Link to your resume (Google Drive, Dropbox, LinkedIn, etc.)
            </p>
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

          {/* GDPR and Compliance Consents Section */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            marginBottom: '20px',
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '20px' }}>🔒</span>
              Data Protection & Compliance
            </h3>

            {/* GDPR Consent - Required */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}>
              <input
                type="checkbox"
                id="gdprConsent"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  cursor: 'pointer',
                  accentColor: '#4f46e5',
                }}
              />
              <label htmlFor="gdprConsent" style={{
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                lineHeight: '1.5',
              }}>
                <strong style={{ color: '#1e293b' }}>GDPR & Data Protection Consent *</strong>
                <br />
                I consent to the collection, processing, and storage of my personal data in accordance with GDPR and applicable labor laws. I understand my rights regarding data access, rectification, and deletion.
              </label>
            </div>

            {/* Data Processing Consent - Required */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}>
              <input
                type="checkbox"
                id="dataProcessingConsent"
                checked={dataProcessingConsent}
                onChange={(e) => setDataProcessingConsent(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  cursor: 'pointer',
                  accentColor: '#4f46e5',
                }}
              />
              <label htmlFor="dataProcessingConsent" style={{
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                lineHeight: '1.5',
              }}>
                <strong style={{ color: '#1e293b' }}>Recruitment Data Processing *</strong>
                <br />
                I authorize the processing of my data for recruitment purposes, including sharing with hiring managers and relevant parties involved in the recruitment process. I consent to receiving offer-related communications and understand that my acceptance of any offer will trigger the onboarding process.
              </label>
            </div>

            {/* Talent Pool Consent - Optional */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}>
              <input
                type="checkbox"
                id="talentPoolConsent"
                checked={talentPoolConsent}
                onChange={(e) => setTalentPoolConsent(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  marginTop: '2px',
                  cursor: 'pointer',
                  accentColor: '#4f46e5',
                }}
              />
              <label htmlFor="talentPoolConsent" style={{
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                lineHeight: '1.5',
              }}>
                <strong style={{ color: '#1e293b' }}>Talent Pool Authorization *</strong>
                <br />
                I authorize the storage of my profile in the company's talent pool for future job opportunities. My data will be retained for up to 24 months and I can withdraw this consent at any time.
              </label>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#64748b',
              marginTop: '12px',
              fontStyle: 'italic',
            }}>
              * Required fields. You can withdraw your consent at any time by contacting our data protection officer.
            </p>
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
