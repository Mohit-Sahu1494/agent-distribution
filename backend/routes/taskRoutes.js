const express = require('express');
const router = express.Router();
const {
  uploadAndDistribute,
  getAllTasks,
  getTasksByAgent,
  getDashboardStats,
  getUploadHistory,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All task routes are protected
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/by-agent', getTasksByAgent);
router.get('/uploads', getUploadHistory);
router.get('/', getAllTasks);
router.post('/upload', upload.single('file'), uploadAndDistribute);

module.exports = router;
