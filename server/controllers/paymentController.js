const Payment = require('../models/Payment');
const Member = require('../models/Member');

const getPayments = async (req, res) => {
  try {
    const { status } = req.query;
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

module.exports = { getPayments, createPayment, markAsPaid };