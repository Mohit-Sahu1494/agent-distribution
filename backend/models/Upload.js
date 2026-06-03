const mongoose = require('mongoose');

/**
 * Upload Schema - tracks file upload history
 */
const uploadSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    batchId: {
      type: String,
      required: true,
      unique: true,
    },
    agentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Upload', uploadSchema);
