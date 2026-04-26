import User from '../models/User.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, data: users, message: 'Users fetched' });
  } catch (error) {
   res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
});
  }
};

// @desc    Update user (deactivate/ban/role)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      // Add logic for ban/deactivate if a field existed in User model
      // user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

      const updatedUser = await user.save();
      res.json({ success: true, data: updatedUser, message: 'User updated' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('listing', 'title')
      .populate('guest', 'name email');
    res.json({ success: true, data: bookings, message: 'All bookings fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all listings
// @route   GET /api/admin/listings
// @access  Private/Admin
export const getAdminListings = async (req, res) => {
  try {
    const listings = await Listing.find({}).populate('host', 'name email');
    res.json({ success: true, data: listings, message: 'All listings fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
