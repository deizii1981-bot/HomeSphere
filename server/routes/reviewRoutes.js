import express from 'express';
import { addReview, getReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addReview);
router.route('/:listingId').get(getReviews);

export default router;
