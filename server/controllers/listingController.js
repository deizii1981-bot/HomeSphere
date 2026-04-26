import Listing from '../models/Listing.js';

// @desc    Get all listings (with search & filter)
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res) => {
  try {
    const { location, propertyType, minPrice, maxPrice, guests } = req.query;

    let query = { isActive: true };

    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
      ];
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    const listings = await Listing.find(query).populate('host', 'name avatar');
    res.json({ success: true, data: listings, message: 'Listings fetched successfully' });
  } catch (error) {
    res.status(500).json({
  success: false,
  message: 'Server Error',
  error: process.env.NODE_ENV === 'development' ? error.message : undefined,
});
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'host',
      'name avatar'
    );

    if (listing) {
      res.json({ success: true, data: listing, message: 'Listing fetched successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private/Host
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      coordinates,
      pricePerNight,
      images,
      amenities,
      propertyType,
      maxGuests,
    } = req.body;

    const listing = new Listing({
      host: req.user._id,
      title,
      description,
      location,
      coordinates,
      pricePerNight,
      images,
      amenities,
      propertyType,
      maxGuests,
    });

    const createdListing = await listing.save();
    res.status(201).json({ success: true, data: createdListing, message: 'Listing created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get host's listings
// @route   GET /api/listings/my
// @access  Private/Host
export const getHostListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id });
    res.json({ success: true, data: listings, message: 'Host listings fetched' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private/Host
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedListing, message: 'Listing updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private/Host
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Check if user is the host
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ success: true, data: null, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
