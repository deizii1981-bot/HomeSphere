import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Please add a price per night'],
    },
    images: {
      type: [String],
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    propertyType: {
      type: String,
      required: [true, 'Please add a property type'],
      enum: ['Apartment', 'House', 'Villa', 'Cabin', 'Hotel', 'Other'],
    },
    maxGuests: {
      type: Number,
      required: [true, 'Please add max guests'],
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
