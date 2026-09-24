const express = require('express');
const router = express.Router();
const {
	getPayments, createPayment, updatePayment, markAsPaid, deletePayment,
} = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getPayments);
router.post('/', verifyToken, createPayment);
router.put('/:id', verifyToken, updatePayment);
router.patch('/:id/mark-paid', verifyToken, markAsPaid);
router.delete('/:id', verifyToken, deletePayment);

module.exports = router;