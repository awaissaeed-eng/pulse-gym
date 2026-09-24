const Plan = require('../models/plan');

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans', details: err.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const { name, price, duration, description } = req.body;

    if (!name || price === undefined || !duration) {
      return res.status(400).json({ error: 'Name, price, and duration are required' });
    }

    const plan = await Plan.create({ name, price, duration, description });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan', details: err.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan', details: err.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan', details: err.message });
  }
};

module.exports = { getPlans, createPlan, updatePlan, deletePlan };