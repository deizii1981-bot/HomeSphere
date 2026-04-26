import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Listing from './models/Listing.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staysphere');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    await Listing.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@staysphere.com', password: 'password123', role: 'admin' },
      { name: 'John Host', email: 'host@staysphere.com', password: 'password123', role: 'host' },
      { name: 'Jane Guest', email: 'guest@staysphere.com', password: 'password123', role: 'guest' },
    ]);

    const hostUserId = createdUsers[1]._id;

    const listings = [
      {
        host: hostUserId,
        title: 'Luxurious Beachfront Villa',
        description: 'Wake up to the sound of waves in this stunning beachfront property.',
        location: { address: '101 Ocean Ave', city: 'Malibu', state: 'CA', country: 'USA' },
        coordinates: { lat: 34.0259, lng: -118.7798 },
        pricePerNight: 450,
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['Pool', 'Wifi', 'Beach access', 'Outdoor shower'],
        propertyType: 'House',
        maxGuests: 8,
        avgRating: 4.9,
        numReviews: 24
      },
      {
        host: hostUserId,
        title: 'Tropical Paradise Bungalow',
        description: 'A cozy bungalow surrounded by palm trees and crystal clear water.',
        location: { address: '77 Lagoon Rd', city: 'Bora Bora', state: 'French Polynesia', country: 'France' },
        coordinates: { lat: -16.5004, lng: -151.7415 },
        pricePerNight: 550,
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['Overwater deck', 'Wifi', 'Snorkeling gear'],
        propertyType: 'House',
        maxGuests: 2,
        avgRating: 5.0,
        numReviews: 15
      },
      {
        host: hostUserId,
        title: 'Modern Penthouse with City Views',
        description: 'Experience the city lights from this high-end penthouse.',
        location: { address: '500 High St', city: 'Tokyo', state: 'Tokyo', country: 'Japan' },
        coordinates: { lat: 35.6762, lng: 139.6503 },
        pricePerNight: 350,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['City view', 'Wifi', 'Concierge', 'Gym'],
        propertyType: 'Apartment',
        maxGuests: 4,
        avgRating: 4.7,
        numReviews: 32
      },
      {
        host: hostUserId,
        title: 'Elegant Italian Villa',
        description: 'A historic villa nestled in the rolling hills of Tuscany.',
        location: { address: 'Via Roma 12', city: 'Siena', state: 'Tuscany', country: 'Italy' },
        coordinates: { lat: 43.3188, lng: 11.3308 },
        pricePerNight: 400,
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['Vineyard view', 'Wine cellar', 'Pool', 'Kitchen'],
        propertyType: 'Villa',
        maxGuests: 10,
        avgRating: 4.95,
        numReviews: 40
      },
      {
        host: hostUserId,
        title: 'A-Frame Mountain Retreat',
        description: 'Escape to the mountains in this cozy A-frame cabin.',
        location: { address: 'Mountain Rd 5', city: 'Aspen', state: 'CO', country: 'USA' },
        coordinates: { lat: 39.1911, lng: -106.8175 },
        pricePerNight: 220,
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['Fireplace', 'Hot tub', 'Hiking trails'],
        propertyType: 'Cabin',
        maxGuests: 4,
        avgRating: 4.8,
        numReviews: 18
      },
      {
        host: hostUserId,
        title: 'Charming Country Farmhouse',
        description: 'Experience rural life in this beautifully restored farmhouse.',
        location: { address: 'Green Lane 1', city: 'Cotswolds', state: 'Gloucestershire', country: 'UK' },
        coordinates: { lat: 51.8330, lng: -1.8433 },
        pricePerNight: 190,
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600'],
        amenities: ['Garden', 'Fireplace', 'Quiet neighborhood', 'Wifi'],
        propertyType: 'Other',
        maxGuests: 5,
        avgRating: 4.9,
        numReviews: 10
      }
    ];

    await Listing.insertMany(listings);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
