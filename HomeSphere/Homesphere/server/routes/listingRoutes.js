import express from 'express';
import {
  getListings,
  getListingById,
  getHostListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, authorize('host'), getHostListings);

router
  .route('/')
  .get(getListings)
  .post(protect, authorize('host', 'admin'), createListing);

router
  .route('/:id')
  .get(getListingById)
  .put(protect, authorize('host', 'admin'), updateListing)
  .delete(protect, authorize('host', 'admin'), deleteListing);

export default router;
