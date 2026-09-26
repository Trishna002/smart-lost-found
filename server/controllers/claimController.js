const Claim = require('../models/Claim');
const Item = require('../models/Item');

// @desc    Create a claim request for an item
// @route   POST /api/claims
// @access  Private
const createClaim = async (req, res) => {
  try {
    const { itemId, message } = req.body;

    if (!itemId || !message) {
      return res.status(400).json({ message: 'Please provide itemId and a message' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Can't claim your own item
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own reported item' });
    }

    // Prevent duplicate pending claims by the same user on the same item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
      status: 'Pending',
    });
    if (existingClaim) {
      return res.status(400).json({ message: 'You already have a pending claim on this item' });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      message,
    });

    const populatedClaim = await claim.populate([
      { path: 'item', select: 'title type status' },
      { path: 'claimant', select: 'name email' },
    ]);

    res.status(201).json(populatedClaim);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating claim', error: error.message });
  }
};

// @desc    Get claims made BY the logged-in user
// @route   GET /api/claims/my-claims
// @access  Private
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate('item', 'title type status location image')
      .sort({ createdAt: -1 });
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your claims', error: error.message });
  }
};

// @desc    Get claims received ON items the logged-in user reported
// @route   GET /api/claims/received
// @access  Private
const getReceivedClaims = async (req, res) => {
  try {
    // Find all items reported by this user first
    const myItems = await Item.find({ reportedBy: req.user._id }).select('_id');
    const myItemIds = myItems.map((item) => item._id);

    const claims = await Claim.find({ item: { $in: myItemIds } })
      .populate('item', 'title type status')
      .populate('claimant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching received claims', error: error.message });
  }
};

// @desc    Approve or reject a claim (only the item's owner can do this)
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const claim = await Claim.findById(req.params.id).populate('item');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Only the item's owner can approve/reject claims on it
    if (claim.item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }

    claim.status = status;
    await claim.save();

    // If approved, mark the item as Claimed and reject other pending claims on it
    if (status === 'Approved') {
      await Item.findByIdAndUpdate(claim.item._id, { status: 'Claimed' });
      await Claim.updateMany(
        { item: claim.item._id, _id: { $ne: claim._id }, status: 'Pending' },
        { status: 'Rejected' }
      );
    }

    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating claim', error: error.message });
  }
};

module.exports = { createClaim, getMyClaims, getReceivedClaims, updateClaimStatus };