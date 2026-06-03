import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(79,142,247,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[420px] relative animate-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple rounded-lg flex items-center justify-center text-2xl mx-auto mb-5 shadow-glow">
              ⚡
            </div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight mb-1.5">
              Admin Dashboard
            </h1>
          </Link>
          <p className="text-text-secondary text-sm">
            Sign in to your admin account
          </p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {errors.general && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-md text-sm mb-5 flex items-start gap-2">
              <span>⚠</span> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'border-danger' : ''}`}
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <p className="text-[0.78rem] text-danger mt-1.25">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'border-danger' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <p className="text-[0.78rem] text-danger mt-1.25">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center py-3 text-sm mt-2"
              disabled={loading}
            >
              {loading ? <><span className="spinner mr-2" /> Signing in…</> : '→ Sign In'}
            </button>
          </form>

          <p className="mt-6 text-sm text-text-secondary text-center">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
              Create One
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
