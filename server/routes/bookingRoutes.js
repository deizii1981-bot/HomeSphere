import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  updateBookingStatus,
  getUnavailableDates,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/host', protect, authorize('host', 'admin'), getHostBookings);
router.put('/:id', protect, updateBookingStatus);
router.get('/listing/:id/dates', getUnavailableDates);

export default router;
