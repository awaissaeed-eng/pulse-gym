const Payment = require('../models/Payment');
const Member = require('../models/Member');

const getPayments = async (req, res) => {
  try {
    const { status } = req.query;

    if (status === 'pending') {
      const now = new Date();
      const members = await Member.find().populate('plan', 'name price duration');
      const allPayments = await Payment.find().sort({ date: -1, createdAt: -1 });
      const latestPaymentByMember = new Map();

      allPayments.forEach((payment) => {
        const memberId = payment.member.toString();
        if (!latestPaymentByMember.has(memberId)) {
          latestPaymentByMember.set(memberId, payment);
        }
      });

      const unpaidMembers = members.filter((member) => {
        const isActive = member.statusOverride === 'active'
          || (!member.statusOverride && member.expiryDate > now);
        const latestPayment = latestPaymentByMember.get(member._id.toString());
        return isActive && (!latestPayment || latestPayment.status !== 'paid');
      });

      const storedPendingIds = unpaidMembers
        .map((member) => latestPaymentByMember.get(member._id.toString()))
        .filter((payment) => payment?.status === 'pending')
        .map((payment) => payment._id);

      const storedPendingPayments = await Payment.find({ _id: { $in: storedPendingIds } })
        .populate('member', 'name phone')
        .sort({ date: -1, createdAt: -1 });
      const storedPendingMemberIds = new Set(
        storedPendingPayments.map((payment) => payment.member._id.toString())
      );

      const dueRows = unpaidMembers
        .filter((member) => !storedPendingMemberIds.has(member._id.toString()))
        .map((member) => ({
          _id: `due-${member._id}`,
          member: { _id: member._id, name: member.name, phone: member.phone },
          memberNameSnapshot: member.name,
          amount: member.plan?.price || 0,
          date: member.expiryDate,
          periodCovered: member.plan?.duration || '',
          status: 'pending',
          isOutstanding: true,
        }));

      return res.json([...storedPendingPayments, ...dueRows]);
    }

    const query = status ? { status } : {};

    const payments = await Payment.find(query)
      .populate('member', 'name phone')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments', details: err.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { member, amount, date, periodCovered, status } = req.body;

    if (!member || !amount || !date) {
      return res.status(400).json({ error: 'Member, amount, and date are required' });
    }

    const memberDoc = await Member.findById(member);
    if (!memberDoc) return res.status(404).json({ error: 'Member not found' });

    const payment = await Payment.create({
      member,
      memberNameSnapshot: memberDoc.name,
      amount,
      date,
      periodCovered,
      status: status || 'pending',
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment', details: err.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { member, amount, date, periodCovered, status } = req.body;

    if (!member || amount === undefined || !date) {
      return res.status(400).json({ error: 'Member, amount, and date are required' });
    }

    const memberDoc = await Member.findById(member);
    if (!memberDoc) return res.status(404).json({ error: 'Member not found' });

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        member,
        memberNameSnapshot: memberDoc.name,
        amount,
        date,
        periodCovered,
        status: status || 'pending',
      },
      { new: true, runValidators: true }
    ).populate('member', 'name phone');

    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment', details: err.message });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'paid' },
      { new: true }
    ).populate('member', 'name phone');

    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark payment as paid', details: err.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete payment', details: err.message });
  }
};

module.exports = { getPayments, createPayment, updatePayment, markAsPaid, deletePayment };