const Member = require('../models/member');
const Payment = require('../models/payment');

const getStats = async (req, res) => {
  try {
    const now = new Date();

    const allMembers = await Member.find().populate('plan', 'price');

    const totalMembers = allMembers.length;

    const activeMembers = allMembers.filter((m) => {
      return m.statusOverride
        ? m.statusOverride === 'active'
        : m.expiryDate > now;
    }).length;

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const monthlyPayments = await Payment.find({
      status: 'paid',
      date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    const previousMonthPayments = await Payment.find({
      status: 'paid',
      date: { $gte: startOfPreviousMonth, $lt: startOfMonth },
    });

    const previousMonthRevenue = previousMonthPayments.reduce((sum, p) => sum + p.amount, 0);
    const revenueChange = previousMonthRevenue === 0
      ? (monthlyRevenue > 0 ? 100 : 0)
      : Math.round(((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const newMembersThisWeek = allMembers.filter((member) => member.createdAt >= startOfWeek).length;

    const memberPayments = await Payment.find()
      .sort({ date: -1, createdAt: -1 })
      .select('member amount status date');
    const latestPaymentByMember = new Map();

    memberPayments.forEach((payment) => {
      const memberId = payment.member.toString();
      if (!latestPaymentByMember.has(memberId)) {
        latestPaymentByMember.set(memberId, payment);
      }
    });

    const unpaidActiveMembers = allMembers.filter((member) => {
      if (member.statusOverride === 'expired' || (!member.statusOverride && member.expiryDate <= now)) {
        return false;
      }

      const latestPayment = latestPaymentByMember.get(member._id.toString());
      return !latestPayment || latestPayment.status !== 'paid';
    });

    const pendingFees = unpaidActiveMembers.reduce((sum, member) => {
      const latestPayment = latestPaymentByMember.get(member._id.toString());
      return sum + (latestPayment?.status === 'pending'
        ? latestPayment.amount
        : member.plan?.price || 0);
    }, 0);
    const unpaidMembers = unpaidActiveMembers.length;

    const recentMembers = (await Member.find()
      .populate('plan', 'name')
      .sort({ createdAt: -1 })
      .limit(5)).map((member) => {
      const obj = member.toObject();
      obj.computedStatus = member.statusOverride
        ? member.statusOverride
        : member.expiryDate > now
        ? 'active'
        : 'expired';
      return obj;
    });

    res.json({
      totalMembers,
      activeMembers,
      monthlyRevenue,
      revenueChange,
      pendingFees,
      unpaidMembers,
      newMembersThisWeek,
      recentMembers,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
};

module.exports = { getStats };