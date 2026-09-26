const Item = require('../models/Item');
const Claim = require('../models/Claim');

// @desc    Get dashboard stats for the logged-in user
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run all counts in parallel instead of sequentially — faster response
    const [totalLost, totalFound, resolvedItems, activeReports, pendingClaimsReceived] =
      await Promise.all([
        Item.countDocuments({ reportedBy: userId, type: 'Lost' }),
        Item.countDocuments({ reportedBy: userId, type: 'Found' }),
        Item.countDocuments({ reportedBy: userId, status: { $in: ['Claimed', 'Resolved'] } }),
        Item.countDocuments({ reportedBy: userId, status: 'Active' }),
        Claim.countDocuments({
          item: { $in: await Item.find({ reportedBy: userId }).distinct('_id') },
          status: 'Pending',
        }),
      ]);

    res.status(200).json({
      totalLost,
      totalFound,
      resolvedItems,
      activeReports,
      pendingClaimsReceived,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };