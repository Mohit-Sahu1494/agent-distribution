const mongoose = require('mongoose');

/**
 * Task Schema - stores distributed tasks from uploaded CSV/XLSX files
 * Each task is assigned to one agent via round-robin distribution
 */
const taskSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: [true, 'Assigned agent is required'],
    },
    uploadBatch: {
      type: String, // Tracks which upload batch this task belongs to
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
