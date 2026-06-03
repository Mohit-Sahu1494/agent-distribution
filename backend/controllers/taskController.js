const fs = require('fs');
const { v4: uuidv4 } = require('crypto');
const Task = require('../models/Task');
const Agent = require('../models/Agent');
const Upload = require('../models/Upload');
const { parseUploadedFile, distributeTasksRoundRobin } = require('../utils/fileParser');

/**
 * @desc    Upload CSV/XLSX and distribute tasks to agents
 * @route   POST /api/tasks/upload
 * @access  Private
 */
const uploadAndDistribute = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file.' });
    }

    const filePath = req.file.path;

    // Parse file
    const { data, error } = parseUploadedFile(filePath);

    // Clean up uploaded file after parsing
    try { fs.unlinkSync(filePath); } catch (_) {}

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid records found in the file.' });
    }

    // Fetch all available agents
    const agents = await Agent.find().select('_id name email');
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No agents available. Please add agents before uploading tasks.',
      });
    }

    // Distribute tasks using round-robin
    const distributedRecords = distributeTasksRoundRobin(data, agents);

    // Generate batch ID for this upload
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save all tasks to DB
    const tasksToInsert = distributedRecords.map((record) => ({
      ...record,
      uploadBatch: batchId,
    }));

    await Task.insertMany(tasksToInsert);

    // Record the upload
    await Upload.create({
      fileName: req.file.filename || req.file.originalname,
      originalName: req.file.originalname,
      totalRecords: data.length,
      batchId,
      agentsCount: agents.length,
    });

    // Build per-agent distribution summary
    const distributionSummary = agents.map((agent) => ({
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      tasksAssigned: distributedRecords.filter(
        (r) => r.assignedAgent.toString() === agent._id.toString()
      ).length,
    }));

    res.status(200).json({
      success: true,
      message: `Successfully distributed ${data.length} tasks across ${agents.length} agents.`,
      totalRecords: data.length,
      agentsCount: agents.length,
      batchId,
      distribution: distributionSummary,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { agentId, page = 1, limit = 50 } = req.query;

    const filter = agentId ? { assignedAgent: agentId } : {};

    const tasks = await Task.find(filter)
      .populate('assignedAgent', 'name email mobile')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};


const getTasksByAgent = async (req, res, next) => {
  try {
    const agents = await Agent.find().select('-password');

    const result = await Promise.all(
      agents.map(async (agent) => {
        const tasks = await Task.find({ assignedAgent: agent._id }).sort({ createdAt: -1 });
        return {
          agent: {
            _id: agent._id,
            name: agent.name,
            email: agent.email,
            mobile: agent.mobile,
          },
          taskCount: tasks.length,
          tasks,
        };
      })
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};


const getDashboardStats = async (req, res, next) => {
  try {
    const [totalAgents, totalTasks, totalUploads] = await Promise.all([
      Agent.countDocuments(),
      Task.countDocuments(),
      Upload.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalAgents,
        totalTasks,
        totalUploads,
        assignedTasks: totalTasks, 
      },
    });
  } catch (error) {
    next(error);
  }
};


const getUploadHistory = async (req, res, next) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, uploads });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadAndDistribute, getAllTasks, getTasksByAgent, getDashboardStats, getUploadHistory };
