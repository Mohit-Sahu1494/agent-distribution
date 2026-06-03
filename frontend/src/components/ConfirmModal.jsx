import { useState } from 'react';

const ConfirmModal = ({ title, message, onConfirm, onClose, danger = true }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content max-w-[440px] relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${danger ? 'bg-danger' : 'bg-primary'}`} />
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0 ${danger ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
            {danger ? '⚠️' : 'ℹ️'}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-text-muted text-[0.65rem] font-bold uppercase tracking-[0.2em] mt-0.5">System Confirmation</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm font-medium leading-relaxed mb-8 px-1">
          {message}
        </p>

        <div className="flex gap-3 justify-end pt-6 border-t border-border">
          <button 
            type="button" 
            className="btn btn-secondary px-6 font-bold" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn px-8 font-black ${danger ? 'bg-danger text-white shadow-lg shadow-danger/20 hover:bg-danger/80' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : danger ? 'Confirm Action' : 'Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
