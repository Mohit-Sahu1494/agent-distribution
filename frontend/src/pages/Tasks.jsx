import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [view, setView] = useState('all'); // 'all' | 'by-agent'
  const [tasks, setTasks] = useState([]);
  const [byAgent, setByAgent] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (selectedAgent) params.append('agentId', selectedAgent);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [page, selectedAgent]);

  const fetchByAgent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/by-agent');
      setByAgent(res.data.data);
    } catch {
      toast.error('Failed to load tasks by agent.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get('/agents').then((res) => setAgents(res.data.agents)).catch(() => {});
  }, []);

  useEffect(() => {
    if (view === 'all') fetchTasks();
    else fetchByAgent();
  }, [view, fetchTasks, fetchByAgent]);

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight">Distributed Tasks</h1>
          <p className="text-sm text-text-secondary mt-1">View all tasks and their assigned agents</p>
        </div>

        {/* View toggle */}
        <div className="flex bg-bg-secondary border border-border rounded-md overflow-hidden">
          {[{ key: 'all', label: 'All Tasks' }, { key: 'by-agent', label: 'By Agent' }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setView(key); setPage(1); }}
              className={`px-4 py-2 text-[0.82rem] font-semibold transition-all duration-200 border-none cursor-pointer font-sans
              ${view === key ? 'bg-primary text-white' : 'bg-transparent text-text-secondary hover:text-text-primary'}`}
            >{label}</button>
          ))}
        </div>
      </div>

      {view === 'all' && (
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <select
              className="form-input w-auto min-w-[200px]"
              value={selectedAgent}
              onChange={(e) => { setSelectedAgent(e.target.value); setPage(1); }}
            >
              <option value="">All Agents</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>{a.name} ({a.email})</option>
              ))}
            </select>
            {selectedAgent && (
              <button className="btn btn-secondary" onClick={() => { setSelectedAgent(''); setPage(1); }}>
                ✕ Clear Filter
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center p-[60px]">
              <div className="spinner w-8 h-8 border-[3px] text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="card">
              <div className="py-[60px] px-5 text-center">
                <div className="text-5xl mb-4 opacity-40">≡</div>
                <p className="text-sm text-text-secondary">No tasks found. Upload a file to distribute tasks.</p>
                <a href="/upload" className="btn btn-primary mt-4 inline-flex">Upload File →</a>
              </div>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-bg-tertiary border-b border-border">
                    <tr>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">#</th>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">First Name</th>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Phone</th>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Notes</th>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Assigned Agent</th>
                      <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, idx) => (
                      <tr key={task._id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 px-4 text-text-muted text-[0.78rem]">
                          {(page - 1) * 20 + idx + 1}
                        </td>
                        <td className="p-3.5 px-4 text-text-primary font-medium">{task.firstName}</td>
                        <td className="p-3.5 px-4 font-mono text-[0.82rem] text-text-secondary">{task.phone}</td>
                        <td className="p-3.5 px-4 max-w-[200px] truncate text-text-secondary">
                          {task.notes || <span className="text-text-muted">—</span>}
                        </td>
                        <td className="p-3.5 px-4">
                          {task.assignedAgent ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white shrink-0"
                                style={{ background: `hsl(${(task.assignedAgent.name?.charCodeAt(0) * 50) % 360}, 60%, 30%)` }}
                              >
                                {task.assignedAgent.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-[0.85rem] text-text-primary">{task.assignedAgent.name}</span>
                            </div>
                          ) : <span className="text-text-muted italic">Unassigned</span>}
                        </td>
                        <td className="p-3.5 px-4 text-text-muted text-[0.78rem]">
                          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button className="btn btn-secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                  <span className="text-[0.82rem] text-text-secondary px-2">
                    Page {page} of {totalPages}
                  </span>
                  <button className="btn btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {view === 'by-agent' && (
        loading ? (
          <div className="flex justify-center p-[60px]">
            <div className="spinner w-8 h-8 border-[3px] text-primary" />
          </div>
        ) : byAgent.length === 0 ? (
          <div className="card">
            <div className="py-[60px] px-5 text-center">
              <div className="text-5xl mb-4 opacity-40">◉</div>
              <p className="text-sm text-text-secondary">No agents or tasks found.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {byAgent.map(({ agent, taskCount, tasks: agentTasks }) => (
              <div key={agent._id} className="card">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white border-2 shrink-0"
                      style={{ 
                        background: `hsl(${(agent.name.charCodeAt(0) * 50) % 360}, 60%, 28%)`,
                        borderColor: `hsl(${(agent.name.charCodeAt(0) * 50) % 360}, 60%, 45%)`
                      }}
                    >
                      {agent.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{agent.name}</div>
                      <div className="text-[0.78rem] text-text-muted font-mono">{agent.email}</div>
                    </div>
                  </div>
                  <span className="badge badge-blue">{taskCount} tasks</span>
                </div>

                {agentTasks.length === 0 ? (
                  <p className="text-sm text-text-muted italic">No tasks assigned yet.</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-bg-tertiary border-b border-border">
                        <tr>
                          <th className="p-2.5 px-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-text-muted">First Name</th>
                          <th className="p-2.5 px-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-text-muted">Phone</th>
                          <th className="p-2.5 px-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-text-muted">Notes</th>
                          <th className="p-2.5 px-4 text-left text-[0.7rem] font-bold uppercase tracking-widest text-text-muted">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentTasks.slice(0, 10).map((t) => (
                          <tr key={t._id} className="border-b border-border last:border-0 hover:bg-white/[0.01]">
                            <td className="p-2.5 px-4 text-text-primary font-medium">{t.firstName}</td>
                            <td className="p-2.5 px-4 font-mono text-[0.8rem] text-text-secondary">{t.phone}</td>
                            <td className="p-2.5 px-4 max-w-[200px] truncate text-text-secondary">
                              {t.notes || <span className="text-text-muted">—</span>}
                            </td>
                            <td className="p-2.5 px-4 text-text-muted text-[0.78rem]">
                              {new Date(t.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {agentTasks.length > 10 && (
                      <p className="text-[0.78rem] text-text-muted p-2.5 px-4">
                        + {agentTasks.length - 10} more tasks. Switch to All Tasks view with filter for full list.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Tasks;
