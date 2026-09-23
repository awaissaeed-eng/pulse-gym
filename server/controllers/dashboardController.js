const Member = require('../models/Member');
const Payment = require('../models/Payment');

const getStats = async (req, res) => {
  try {
    const now = new Date();

    const allMembers = await Member.find();

    const totalMembers = allMembers.length;

    const activeMembers = allMembers.filter((m) => {
      return m.statusOverride
        ? m.statusOverride === 'active'
        : m.expiryDate > now;
    }).length;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyPayments = await Payment.find({
      status: 'paid',
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = await Payment.find({ status: 'pending' });
    const pendingFees = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

    const recentMembers = await Member.find()
      .populate('plan', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalMembers,
      activeMembers,
      monthlyRevenue,
      pendingFees,
      recentMembers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

module.exports = { getStats };