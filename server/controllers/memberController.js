const Member = require('../models/member');
const Plan = require('../models/plan');

const calculateExpiryDate = (joinDate, duration) => {
  const date = new Date(joinDate);
  if (duration === 'monthly') date.setMonth(date.getMonth() + 1);
  if (duration === 'quarterly') date.setMonth(date.getMonth() + 3);
  if (duration === 'yearly') date.setFullYear(date.getFullYear() + 1);
  return date;
};

const getMembers = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const members = await Member.find(query)
      .populate('plan', 'name price duration')
      .sort({ createdAt: -1 });

    const now = new Date();
    let result = members.map((m) => {
      const obj = m.toObject();
      obj.computedStatus = m.statusOverride
        ? m.statusOverride
        : m.expiryDate > now
        ? 'active'
        : 'expired';
      return obj;
    });

    if (status) {
      result = result.filter((m) => m.computedStatus === status);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members', details: err.message });
  }
};

const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate('plan');
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const obj = member.toObject();
    const now = new Date();
    obj.computedStatus = member.statusOverride
      ? member.statusOverride
      : member.expiryDate > now
      ? 'active'
      : 'expired';

    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch member', details: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, phone, email, plan, joinDate } = req.body;

    if (!name || !phone || !plan || !joinDate) {
      return res.status(400).json({ error: 'Name, phone, plan, and joinDate are required' });
    }

    const planDoc = await Plan.findById(plan);
    if (!planDoc) return res.status(404).json({ error: 'Plan not found' });

    const expiryDate = calculateExpiryDate(joinDate, planDoc.duration);

    const member = await Member.create({
      name, phone, email, plan, joinDate, expiryDate,
    });

    const populated = await member.populate('plan', 'name price duration');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create member', details: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { name, phone, email, plan, joinDate } = req.body;
    const updateData = { name, phone, email };

    if (plan && joinDate) {
      const planDoc = await Plan.findById(plan);
      if (!planDoc) return res.status(404).json({ error: 'Plan not found' });
      updateData.plan = plan;
      updateData.joinDate = joinDate;
      updateData.expiryDate = calculateExpiryDate(joinDate, planDoc.duration);
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('plan', 'name price duration');

    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update member', details: err.message });
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { statusOverride } = req.body;

    if (!['active', 'expired', null].includes(statusOverride)) {
      return res.status(400).json({ error: 'statusOverride must be active, expired, or null' });
    }

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { statusOverride },
      { new: true }
    ).populate('plan', 'name price duration');

    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete member', details: err.message });
  }
};

module.exports = {
  getMembers, getMember, createMember,
  updateMember, updateMemberStatus, deleteMember,
};