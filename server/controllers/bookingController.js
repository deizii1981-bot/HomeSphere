import Booking from '../models/Booking.js';
import Listing from '../models/Listing.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
  listing: listingId,
  status: { $in: ['pending', 'confirmed'] },
  checkIn: { $lt: checkOutDate },
  checkOut: { $gt: checkInDate },
});

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ success: false, message: 'These dates are already booked.' });
    }

    // Calculate total price (simplified, ideally dates diff)
    const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = nights * listing.pricePerNight;

    const booking = new Booking({
      guest: req.user._id,
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice,
    });

    const createdBooking = await booking.save();
    res.status(201).json({ success: true, data: createdBooking, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({
     success: false,
     message: 'Server Error',
     error: process.env.NODE_ENV === 'development' ? error.message : undefined,
});
  }
};

// @desc    Get user bookings (Guest)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id }).populate(
      'listing',
      'title location images pricePerNight'
    );
    res.json({ success: true, data: bookings, message: 'Bookings fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get host bookings
// @route   GET /api/bookings/host
// @access  Private/Host
export const getHostBookings = async (req, res) => {
  try {
    // Find all listings by this host
    const listings = await Listing.find({ host: req.user._id }).select('_id');
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('listing', 'title')
      .populate('guest', 'name email avatar');

    res.json({ success: true, data: bookings, message: 'Host bookings fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Host
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // RBAC: Guest can cancel their own booking. Host/Admin can update to confirmed/rejected/completed.
    const isGuestCancelling = booking.guest.toString() === req.user._id.toString() && status === 'cancelled';
    const isHostOrAdmin = booking.listing.host.toString() === req.user._id.toString() || req.user.role === 'admin';

    if (!isGuestCancelling && !isHostOrAdmin) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();

    res.json({ success: true, data: updatedBooking, message: 'Booking status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unavailable dates for a listing
// @route   GET /api/bookings/listing/:id/dates
// @access  Public
export const getUnavailableDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      listing: req.params.id,
      status: { $in: ['pending', 'confirmed'] },
    }).select('checkIn checkOut');

    res.json({ success: true, data: bookings, message: 'Unavailable dates fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
