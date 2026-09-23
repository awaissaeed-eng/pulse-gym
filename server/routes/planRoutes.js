const express = require('express');
const router = express.Router();
const { getPlans, createPlan, updatePlan, deletePlan } = require('../controllers/planController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getPlans);
router.post('/', verifyToken, createPlan);
router.put('/:id', verifyToken, updatePlan);
router.delete('/:id', verifyToken, deletePlan);

module.exports = router;