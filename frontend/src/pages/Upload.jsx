import { useState, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['.csv', '.xlsx', '.xls'];

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      return `Invalid file type "${ext}". Only .csv, .xlsx, and .xls files are accepted.`;
    }
    if (f.size > 10 * 1024 * 1024) {
      return 'File size exceeds 10MB limit.';
    }
    return null;
  };

  const handleFileSelect = (f) => {
    setResult(null);
    setError('');
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/tasks/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      setFile(null);
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      <div className="mb-7">
        <h1 className="text-[1.75rem] font-bold text-text-primary tracking-tight">Upload File</h1>
        <p className="text-sm text-text-secondary mt-1">Upload a CSV or XLSX file to distribute tasks across agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-6">
          {/* Upload Zone */}
          {!result && (
            <div className="card">
              <div
                className={`border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer transition-all duration-400 bg-bg-tertiary hover:border-primary hover:bg-primary/5 ${dragging ? 'border-primary bg-primary/5' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-5xl mb-4 block">
                  {file ? '📄' : '☁'}
                </span>
                {file ? (
                  <>
                    <p className="text-base font-semibold text-primary mb-1.5">{file.name}</p>
                    <p className="text-[0.82rem] text-text-muted">{(file.size / 1024).toFixed(1)} KB — Click to change</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-semibold text-text-primary mb-1.5">Drop your file here or click to browse</p>
                    <p className="text-[0.82rem] text-text-muted">Supports .csv, .xlsx, .xls — Max 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => { if (e.target.files[0]) handleFileSelect(e.target.files[0]); }}
                />
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-md text-sm mt-4">
                  ⚠ {error}
                </div>
              )}

              {file && (
                <div className="flex gap-2.5 mt-4">
                  <button
                    className="btn btn-primary flex-1 justify-center"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? <><span className="spinner mr-2" /> Uploading & Distributing…</> : '⊕ Upload & Distribute'}
                  </button>
                  <button className="btn btn-secondary px-3.5" onClick={handleReset}>✕</button>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="card animate-in space-y-6">
              <div className="bg-success/10 border border-success/20 text-success p-3 rounded-md text-sm">
                ✓ {result.message}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Records', value: result.totalRecords, color: 'text-primary' },
                  { label: 'Agents Used', value: result.agentsCount, color: 'text-success' },
                  { label: 'Per Agent (avg)', value: Math.ceil(result.totalRecords / result.agentsCount), color: 'text-purple' },
                ].map((s) => (
                  <div key={s.label} className="bg-bg-tertiary border border-border rounded-md p-3.5 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-[0.72rem] text-text-muted uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-[0.875rem] font-semibold text-text-secondary uppercase tracking-widest">
                Distribution Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {result.distribution.map((item) => (
                  <div key={item.agentId} className="bg-bg-tertiary border border-border rounded-md p-4 transition-all duration-250 hover:border-primary">
                    <div className="font-semibold text-[0.875rem] text-text-primary mb-1">{item.agentName}</div>
                    <div className="text-[0.75rem] text-text-muted mb-3 truncate">{item.agentEmail}</div>
                    <div className="text-3xl font-bold text-primary leading-none">{item.tasksAssigned}</div>
                    <div className="text-[0.72rem] text-text-muted uppercase tracking-wider">tasks assigned</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button className="btn btn-primary" onClick={handleReset}>Upload Another File</button>
                <a href="/tasks" className="btn btn-secondary">View All Tasks →</a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-[0.8rem] font-bold uppercase tracking-widest text-text-muted mb-3.5">
              Required Columns
            </h3>
            <div className="space-y-2">
              {['FirstName', 'Phone', 'Notes'].map((col) => (
                <div key={col} className="flex items-center gap-2">
                  <span className="text-success text-[0.8rem]">✓</span>
                  <code className="font-mono text-[0.82rem] text-text-primary">{col}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-[0.8rem] font-bold uppercase tracking-widest text-text-muted mb-3.5">
              Distribution Logic
            </h3>
            <p className="text-[0.82rem] text-text-secondary leading-relaxed">
              Records are distributed using <strong className="text-text-primary">round-robin</strong> across all available agents.
            </p>
            <div className="mt-3 p-2.5 bg-bg-tertiary rounded-md font-mono text-[0.75rem] text-text-secondary">
              25 records ÷ 5 agents<br />
              = 5 tasks per agent
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-[0.8rem] font-bold uppercase tracking-widest text-text-muted mb-2.5">
              Accepted Formats
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {['.csv', '.xlsx', '.xls'].map((fmt) => (
                <span key={fmt} className="badge badge-blue">{fmt}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
