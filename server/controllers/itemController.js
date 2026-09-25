const Item = require('../models/Item');

// @desc    Create a new lost/found item report
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, date } = req.body;

    if (!title || !description || !category || !type || !location || !date) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      date,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      reportedBy: req.user._id, // comes from protect middleware
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating item', error: error.message });
  }
};

// @desc    Get all items with search & filter
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { search, type, category, location, status } = req.query;

    const query = {};

    if (search) {
      // case-insensitive partial match on title or description
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) query.type = type;
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (status) query.status = status;

    const items = await Item.find(query)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching items', error: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching item', error: error.message });
  }
};

// @desc    Get items reported by the logged-in user
// @route   GET /api/items/my-reports
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching your items', error: error.message });
  }
};

// @desc    Update an item (only by its owner)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, category, type, location, date, status } = req.body;

    item.title = title ?? item.title;
    item.description = description ?? item.description;
    item.category = category ?? item.category;
    item.type = type ?? item.type;
    item.location = location ?? item.location;
    item.date = date ?? item.date;
    item.status = status ?? item.status;
    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    }

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating item', error: error.message });
  }
};

// @desc    Delete an item (only by its owner)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting item', error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
};