import toast from 'react-hot-toast';

const customToast = {
  success: (message) => toast.success(message, {
    style: {
      borderLeft: '4px solid #22c55e',
    },
  }),
  error: (message) => toast.error(message, {
    style: {
      borderLeft: '4px solid #ef4444',
    },
  }),
  info: (message) => toast(message, {
    icon: 'ℹ️',
    style: {
      borderLeft: '4px solid #4f8ef7',
    },
  }),
};

export default customToast;
