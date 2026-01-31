import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';
import { Lock, User, Mail, ArrowRight, Loader2, Phone } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phoneNumber: '', 
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data;
      if (isLogin) {
        // Use 'email' field as the generic identifier
        data = await loginUser({ identifier: formData.email, password: formData.password });
      } else {
        data = await registerUser(formData);
      }
      
      // Save session
      localStorage.setItem('civic_token', data.token);
      localStorage.setItem('civic_user_id', data.userId);
      localStorage.setItem('civic_user_name', data.name);
      
      // Redirect
      navigate('/profile');
      window.location.reload(); // Force reload to update Layout state
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-h-screen py-5 bg-light">
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-10 rounded-circle" style={{ width: '48px', height: '48px' }}>
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="h4 fw-bold text-dark">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </h1>
          <p className="text-muted small">
            {isLogin ? 'Sign in with Email, Username, or Phone' : 'Create an account to report issues'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 text-small mb-4">
            {error}
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                       <input
                          type="text"
                          className="form-control bg-light"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">Username</label>
                       <input
                          type="text"
                          className="form-control bg-light"
                          placeholder="john_d"
                          value={formData.username}
                          onChange={e => setFormData({...formData, username: e.target.value})}
                          required
                        />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase">
                  {isLogin ? 'Email / Username / Phone' : 'Email Address'}
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    {isLogin ? <User size={18} className="text-muted" /> : <Mail size={18} className="text-muted" />}
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0 bg-light"
                    placeholder={isLogin ? "Enter email, username, or phone" : "citizen@example.com"}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Phone (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Phone size={18} className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      className="form-control border-start-0 ps-0 bg-light"
                      placeholder="+1234567890"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 ps-0 bg-light"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 hover-scale transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="position-relative my-4">
              <div className="progress" style={{ height: '1px' }}>
                <div className="progress-bar bg-secondary opacity-25" role="progressbar" style={{ width: '100%' }}></div>
              </div>
              <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 small text-muted text-uppercase fw-bold">Or continue with</span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary fw-semibold d-flex align-items-center justify-content-center gap-2 bg-white hover-scale transition-all w-100"
                onClick={() => alert('Google login coming soon!')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              
              <button 
                type="button" 
                className="btn btn-outline-secondary fw-semibold d-flex align-items-center justify-content-center gap-2 bg-white hover-scale transition-all w-100"
                onClick={() => alert('Facebook login coming soon!')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-5.978 5.814-5.978.855 0 1.858.193 1.858.193v2.924h-1.053c-2.432 0-2.44 1.176-2.44 2.58v1.86h4.114l-.493 3.667h-3.621v7.98C19.86 21.01 23 16.5 23 12c0-6.075-4.925-11-11-11S1 5.925 1 12c0 4.5 3.14 9.01 6.101 11.691z" fill="#1877F2"/>
                  <path d="M14 13h-3v3h-2v-3H6l-.5-2h3.5V9.5C9 7.5 10.5 6 12.5 6H15v2h-2.5c-.5 0-1 .5-1 1v2H15l-1 2z" fill="white"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
