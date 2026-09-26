const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus,
} = require('../controllers/claimController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createClaim);
router.get('/my-claims', protect, getMyClaims);
router.get('/received', protect, getReceivedClaims);
router.put('/:id', protect, updateClaimStatus);

module.exports = router;