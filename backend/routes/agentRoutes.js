const express = require('express');
const router = express.Router();
const {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} = require('../controllers/agentController');
const { protect } = require('../middleware/auth');

// All agent routes are protected
router.use(protect);

router.route('/').get(getAllAgents).post(createAgent);
router.route('/:id').get(getAgentById).put(updateAgent).delete(deleteAgent);

module.exports = router;
