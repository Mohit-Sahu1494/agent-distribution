import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import AgentModal from '../components/AgentModal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [deletingAgent, setDeletingAgent] = useState(null);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await api.get('/agents');
      setAgents(res.data.agents);
    } catch {
      toast.error('Failed to load agents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleOpenAdd = () => {
    setEditingAgent(null);
    setShowModal(true);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingAgent) {
        await api.put(`/agents/${editingAgent._id}`, formData);
        toast.success('Agent updated successfully');
      } else {
        await api.post('/agents', formData);
        toast.success('Agent added successfully');
      }
      setShowModal(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save agent.';
      toast.error(msg);
      throw err;
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/agents/${deletingAgent._id}`);
      toast.success('Agent deleted successfully');
      setDeletingAgent(null);
      fetchAgents();
    } catch {
      toast.error('Failed to delete agent.');
    }
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight">Agents</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your task distribution agents</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add Agent
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 mb-5">
        <span className="badge badge-blue">{agents.length} agents</span>
        {agents.length > 0 && (
          <span className="text-[0.8rem] text-text-secondary">
            Tasks will be distributed equally across all agents
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-[60px]">
          <div className="spinner w-8 h-8 border-[3px] text-primary" />
        </div>
      ) : agents.length === 0 ? (
        <div className="card">
          <div className="py-[60px] px-5 text-center">
            <div className="text-5xl mb-4 opacity-40">◉</div>
            <p className="font-semibold text-text-secondary mb-1.5">No agents yet</p>
            <p className="text-sm text-text-muted">Add your first agent to start distributing tasks.</p>
            <button className="btn btn-primary mt-4" onClick={handleOpenAdd}>
              + Add First Agent
            </button>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-bg-tertiary border-b border-border">
              <tr>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">#</th>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Name</th>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Email</th>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Mobile</th>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Added</th>
                <th className="p-3 px-4 text-left text-[0.72rem] font-bold uppercase tracking-widest text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, idx) => (
                <tr key={agent._id} className="border-b border-border last:border-0 hover:bg-white/[0.02] transition-colors animate-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  <td className="p-3.5 px-4 text-text-muted text-[0.8rem]">{idx + 1}</td>
                  <td className="p-3.5 px-4 text-text-primary font-medium">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[0.8rem] font-bold text-white shrink-0"
                        style={{ background: `hsl(${(agent.name.charCodeAt(0) * 50) % 360}, 60%, 30%)` }}
                      >
                        {agent.name[0].toUpperCase()}
                      </div>
                      {agent.name}
                    </div>
                  </td>
                  <td className="p-3.5 px-4 font-mono text-[0.82rem]">{agent.email}</td>
                  <td className="p-3.5 px-4 font-mono text-[0.82rem]">{agent.mobile}</td>
                  <td className="p-3.5 px-4 text-text-muted text-[0.78rem]">
                    {new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-3.5 px-4">
                    <div className="flex gap-1.5">
                      <button
                        className="btn btn-secondary p-2 rounded-sm text-sm"
                        title="Edit"
                        onClick={() => handleEdit(agent)}
                      >✏</button>
                      <button
                        className="btn btn-danger p-2 rounded-sm text-sm"
                        title="Delete"
                        onClick={() => setDeletingAgent(agent)}
                      >🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AgentModal
          agent={editingAgent}
          onClose={() => { setShowModal(false); setEditingAgent(null); }}
          onSave={handleSave}
        />
      )}

      {deletingAgent && (
        <ConfirmModal
          title="Delete Agent"
          message={`Are you sure you want to delete "${deletingAgent.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setDeletingAgent(null)}
        />
      )}
    </div>
  );
};

export default Agents;
