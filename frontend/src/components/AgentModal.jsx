import { useState, useEffect } from 'react';

const initialForm = { name: '', email: '', mobile: '', password: '' };

const AgentModal = ({ agent, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!agent;

  useEffect(() => {
    if (agent) {
      setForm({ name: agent.name, email: agent.email, mobile: agent.mobile, password: '' });
    }
  }, [agent]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required';
    if (!isEdit && !form.password) errs.password = 'Password is required';
    if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      await onSave(payload);
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{isEdit ? 'Update Personnel' : 'Enroll New Agent'}</h2>
            <p className="text-text-secondary text-xs font-medium mt-1 uppercase tracking-widest">Agent Management System</p>
          </div>
          <button 
            className="w-10 h-10 rounded-xl bg-bg-tertiary border border-border text-text-muted hover:text-white hover:border-border-light transition-all duration-300 flex items-center justify-center group" 
            onClick={onClose}
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="space-y-2">
            <label className="form-label">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                className={`form-input pl-11 ${errors.name ? 'border-danger focus:ring-danger/5' : ''}`}
                placeholder="Ex: John Doe"
                value={form.name}
                onChange={handleChange}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">👤</span>
            </div>
            {errors.name && <p className="text-xs text-danger font-bold mt-1.5">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="form-label">Email Access</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className={`form-input pl-11 ${errors.email ? 'border-danger focus:ring-danger/5' : ''}`}
                  placeholder="agent@flow.com"
                  value={form.email}
                  onChange={handleChange}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">✉️</span>
              </div>
              {errors.email && <p className="text-xs text-danger font-bold mt-1.5">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="form-label">Phone Reference</label>
              <div className="relative">
                <input
                  type="text"
                  name="mobile"
                  className={`form-input pl-11 ${errors.mobile ? 'border-danger focus:ring-danger/5' : ''}`}
                  placeholder="+1 (555) 000"
                  value={form.mobile}
                  onChange={handleChange}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">📱</span>
              </div>
              {errors.mobile && <p className="text-xs text-danger font-bold mt-1.5">{errors.mobile}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="form-label">
              Security Key {isEdit && <span className="text-[0.6rem] text-text-muted normal-case tracking-normal ml-2 opacity-60">(Optional)</span>}
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                className={`form-input pl-11 ${errors.password ? 'border-danger focus:ring-danger/5' : ''}`}
                placeholder={isEdit ? "Unchanged" : "Minimum 6 characters"}
                value={form.password}
                onChange={handleChange}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">🔒</span>
            </div>
            {errors.password && <p className="text-xs text-danger font-bold mt-1.5">{errors.password}</p>}
          </div>

          <div className="flex gap-4 justify-end mt-10 pt-8 border-t border-border">
            <button type="button" className="btn btn-secondary px-6" onClick={onClose} disabled={loading}>
              Discard
            </button>
            <button type="submit" className="btn btn-primary px-8 shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? <span className="spinner" /> : isEdit ? 'Update Record' : 'Enroll Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentModal;
