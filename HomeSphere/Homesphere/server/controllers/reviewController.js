import Review from '../models/Review.js';
import Listing from '../models/Listing.js';

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // A guest shouldn't be able to review unless they booked, but we'll skip that check for simplicity in this project

    // Prevent host from reviewing their own property
    if (listing.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Hosts cannot review their own property' });
    }

    const review = await Review.create({
      listing: listingId,
      author: req.user._id,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({ success: true, data: review, message: 'Review added successfully' });
  } catch (error) {
    // Check for duplicate key error (user already reviewed)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this listing' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).populate(
      'author',
      'name avatar'
    );
    res.json({ success: true, data: reviews, message: 'Reviews fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
