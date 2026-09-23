const express = require('express');
const router = express.Router();
const {
  getMembers, getMember, createMember,
  updateMember, updateMemberStatus, deleteMember,
} = require('../controllers/memberController');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getMembers);
router.post('/', verifyToken, createMember);
router.get('/:id', verifyToken, getMember);
router.put('/:id', verifyToken, updateMember);
router.put('/:id/status', verifyToken, updateMemberStatus);
router.delete('/:id', verifyToken, deleteMember);

module.exports = router;