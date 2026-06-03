const Agent = require('../models/Agent');

/**
 * @desc    Get all agents
 * @route   GET /api/agents
 * @access  Private
 */
const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    next(error);
  }
};


const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    res.status(200).json({ success: true, agent });
  } catch (error) {
    next(error);
  }
};

const createAgent = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check required fields
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, mobile, and password.',
      });
    }

    // Check for duplicate email
    const emailExists = await Agent.findOne({ email: email.toLowerCase().trim() });
    if (emailExists) {
      return res.status(409).json({ success: false, message: 'An agent with this email already exists.' });
    }

    // Check for duplicate mobile
    const mobileExists = await Agent.findOne({ mobile: mobile.trim() });
    if (mobileExists) {
      return res.status(409).json({ success: false, message: 'An agent with this mobile number already exists.' });
    }

    const agent = await Agent.create({ name, email, mobile, password });

    res.status(201).json({
      success: true,
      message: 'Agent created successfully.',
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        createdAt: agent.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update agent
 * @route   PUT /api/agents/:id
 * @access  Private
 */
const updateAgent = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    // Check duplicate email (exclude current agent)
    if (email && email.toLowerCase() !== agent.email) {
      const emailExists = await Agent.findOne({ email: email.toLowerCase().trim(), _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(409).json({ success: false, message: 'An agent with this email already exists.' });
      }
    }

    // Check duplicate mobile (exclude current agent)
    if (mobile && mobile !== agent.mobile) {
      const mobileExists = await Agent.findOne({ mobile: mobile.trim(), _id: { $ne: req.params.id } });
      if (mobileExists) {
        return res.status(409).json({ success: false, message: 'An agent with this mobile number already exists.' });
      }
    }

    // Update fields
    if (name) agent.name = name;
    if (email) agent.email = email.toLowerCase().trim();
    if (mobile) agent.mobile = mobile.trim();
    if (password) agent.password = password; // Pre-save hook will hash it

    await agent.save();

    res.status(200).json({
      success: true,
      message: 'Agent updated successfully.',
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        updatedAt: agent.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete agent
 * @route   DELETE /api/agents/:id
 * @access  Private
 */
const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent not found.' });
    }

    await agent.deleteOne();

    res.status(200).json({ success: true, message: 'Agent deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAgents, getAgentById, createAgent, updateAgent, deleteAgent };
