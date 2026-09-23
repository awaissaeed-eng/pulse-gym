const express = require('express');
const router = express.Router();
const { getPayments, createPayment, markAsPaid } = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getPayments);
router.post('/', verifyToken, createPayment);
router.patch('/:id/mark-paid', verifyToken, markAsPaid);

module.exports = router;