import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ value, label, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className={`w-11 h-11 rounded-md flex items-center justify-center text-xl mb-4 ${
      color === 'blue' ? 'bg-primary/10 text-primary' :
      color === 'green' ? 'bg-success/10 text-success' :
      color === 'purple' ? 'bg-purple/10 text-purple' :
      'bg-warning/10 text-warning'
    }`}>{icon}</div>
    <div className="text-3xl font-bold text-text-primary leading-none mb-1 tabular-nums">{value ?? '—'}</div>
    <div className="text-[0.8rem] text-text-secondary uppercase tracking-wider font-medium">{label}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, uploadsRes] = await Promise.all([
          api.get('/tasks/stats'),
          api.get('/tasks/uploads'),
        ]);
        setStats(statsRes.data.stats);
        setUploads(uploadsRes.data.uploads.slice(0, 5));
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Overview of your agent task distribution system</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[140px] bg-bg-secondary rounded-lg border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard value={stats?.totalAgents} label="Total Agents" icon="◉" color="blue" />
          <StatCard value={stats?.totalTasks} label="Total Tasks" icon="≡" color="green" />
          <StatCard value={stats?.totalUploads} label="Uploaded Files" icon="⊕" color="purple" />
          <StatCard value={stats?.assignedTasks} label="Assigned Tasks" icon="✓" color="orange" />
        </div>
      )}

      {/* Recent Uploads */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Recent Uploads</h2>
          <a href="/upload" className="text-[0.8rem] text-primary hover:opacity-80 transition-opacity">Upload new →</a>
        </div>

        {uploads.length === 0 ? (
          <div className="py-[60px] px-5 text-center">
            <div className="text-5xl mb-4 opacity-40">📂</div>
            <p className="text-sm text-text-secondary">No files uploaded yet. Upload a CSV or XLSX file to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-bg-tertiary border-b border-border">
                <tr>
                  <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">File Name</th>
                  <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Records</th>
                  <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Agents</th>
                  <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload._id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 px-4 text-text-primary font-medium">
                      <span className="font-mono text-[0.82rem]">
                        {upload.originalName}
                      </span>
                    </td>
                    <td className="p-3.5 px-4"><span className="badge badge-green">{upload.totalRecords} records</span></td>
                    <td className="p-3.5 px-4"><span className="badge badge-blue">{upload.agentsCount} agents</span></td>
                    <td className="p-3.5 px-4 text-text-muted text-[0.8rem]">
                      {new Date(upload.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
