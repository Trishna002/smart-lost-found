const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem);

router.get('/my-reports', protect, getMyItems);

router.route('/:id')
  .get(getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

module.exports = router;