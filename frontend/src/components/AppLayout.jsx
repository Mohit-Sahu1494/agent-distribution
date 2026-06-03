import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[260px] min-h-screen bg-bg relative">
        {/* Decorative background for main content */}
        <div className="fixed top-0 right-0 w-[40%] h-[40%] bg-[radial-gradient(circle_at_70%_20%,rgba(79,142,247,0.03)_0%,transparent_70%)] pointer-events-none z-0" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
