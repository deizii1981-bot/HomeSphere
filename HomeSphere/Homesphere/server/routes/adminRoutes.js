import express from 'express';
import {
  getUsers,
  updateUser,
  getAdminBookings,
  getAdminListings,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/users').get(protect, authorize('admin'), getUsers);
router.route('/users/:id').put(protect, authorize('admin'), updateUser);
router.route('/bookings').get(protect, authorize('admin'), getAdminBookings);
router.route('/listings').get(protect, authorize('admin'), getAdminListings);

export default router;
