import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '◈', label: 'Dashboard' },
  { path: '/agents', icon: '◉', label: 'Agents' },
  { path: '/upload', icon: '⊕', label: 'Upload File' },
  { path: '/tasks', icon: '≡', label: 'Distributed Tasks' },
];

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen fixed left-0 top-0 bg-bg-secondary border-r border-border flex flex-col z-[100] overflow-hidden">
      {/* Logo */}
      <div className="p-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple rounded-md flex items-center justify-center text-lg shadow-glow shrink-0">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-primary leading-tight">Admin Dashboard</span>
            <span className="text-[0.7rem] text-text-muted uppercase tracking-wider">Task Distribution</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[0.68rem] font-semibold uppercase tracking-widest text-text-muted px-2.5 py-2 mb-1">
          Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-2.5 px-3 py-2 rounded-sm text-[0.875rem] font-medium transition-all duration-200 mb-0.5
              ${isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}`
            }
          >
            <span className="text-base w-[18px] text-center shrink-0">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="p-2.5 bg-bg-tertiary rounded-md mb-2">
          <div className="text-[0.72rem] text-text-muted uppercase tracking-wider mb-0.5">
            Signed in as
          </div>
          <div className="text-[0.82rem] text-text-primary font-medium truncate">
            {admin?.email}
          </div>
        </div>
        <button 
          className="btn btn-secondary w-full justify-center" 
          onClick={handleLogout}
        >
          <span className="mr-1">↩</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
