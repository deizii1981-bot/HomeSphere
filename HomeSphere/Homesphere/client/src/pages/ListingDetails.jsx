import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Star, MapPin, Users, Home as HomeIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Booking state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchListingAndReviews = async () => {
      try {
        const { data: listingData } = await axios.get(`/api/listings/${id}`);
        setListing(listingData);
        
        const { data: reviewsData } = await axios.get(`/api/reviews/${id}`);
        setReviews(reviewsData);

        const { data: datesData } = await axios.get(`/api/bookings/listing/${id}/dates`);
        const intervals = datesData.map(d => ({
          start: new Date(d.checkIn),
          end: new Date(d.checkOut)
        }));
        setUnavailableDates(intervals);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching listing details');
        setLoading(false);
      }
    };

    fetchListingAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setReviewLoading(true);
    try {
      await axios.post('/api/reviews', {
        listingId: id,
        rating: reviewRating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const { data: reviewsData } = await axios.get(`/api/reviews/${id}`);
      setReviews(reviewsData);
      setReviewComment('');
      alert('Review added successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setBookingLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.post('/api/bookings', {
        listingId: id,
        checkIn: startDate,
        checkOut: endDate,
        guests
      }, config);
      
      alert('Booking successful! View it in your dashboard.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading details...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;
  if (!listing) return null;

  // Calculate nights
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const totalPrice = nights * listing.pricePerNight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text-dark mb-2">{listing.title}</h1>
      
      <div className="flex justify-between items-center mb-6 text-sm font-semibold text-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-black" />
            <span>{listing.avgRating > 0 ? listing.avgRating.toFixed(1) : 'New'}</span>
            <span className="underline ml-1 cursor-pointer">{listing.numReviews} reviews</span>
          </div>
          <div className="flex items-center gap-1 underline cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span>{listing.location.city}, {listing.location.state}, {listing.location.country}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[50vh]">
        <img 
          src={listing.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
          alt="Main" 
          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
        />
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
             <img 
               key={i}
               src={listing.images[i] || listing.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
               alt={`Gallery ${i}`} 
               className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
             />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Hosted by {listing.host?.name || 'User'}</h2>
              <div className="flex gap-4 text-gray-600 text-base">
                <span className="flex items-center gap-1"><Users className="h-4 w-4"/> {listing.maxGuests} guests</span>
                <span className="flex items-center gap-1"><HomeIcon className="h-4 w-4"/> {listing.propertyType}</span>
              </div>
            </div>
            {listing.host?.avatar && (
              <img src={listing.host.avatar} alt="Host" className="h-14 w-14 rounded-full object-cover" />
            )}
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">About this space</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-700">
                  <Star className="h-5 w-5 text-gray-400" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4 mb-6">
                {reviews.map(review => (
                  <div key={review._id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                       <img src={review.author?.avatar} alt={review.author?.name} className="w-8 h-8 rounded-full" />
                       <span className="font-semibold">{review.author?.name}</span>
                       <div className="flex items-center text-sm text-gray-600 ml-auto">
                         <Star className="w-4 h-4 text-primary fill-current mr-1" />
                         {review.rating} / 5
                       </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            
            {user && listing.host?._id !== user._id && (
              <form onSubmit={handleReviewSubmit} className="bg-white border rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold mb-3">Leave a Review</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">Rating:</span>
                  <select 
                    value={reviewRating} 
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="border rounded p-1"
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <textarea 
                  required
                  rows="3"
                  className="w-full border rounded-lg p-2 mb-3 outline-none focus:border-primary"
                  placeholder="Share your experience..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                ></textarea>
                <button 
                  type="submit" 
                  disabled={reviewLoading}
                  className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
          
          {/* Map Integration using react-leaflet */}
          <div className="border-b pb-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Where you'll be</h3>
            <div className="h-96 rounded-xl overflow-hidden shadow-sm z-0 relative">
              {(listing.coordinates && listing.coordinates.lat && listing.coordinates.lng) ? (
                <MapContainer center={[listing.coordinates.lat, listing.coordinates.lng]} zoom={13} scrollWheelZoom={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[listing.coordinates.lat, listing.coordinates.lng]}>
                    <Popup>{listing.title}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                  Location coordinates not available
                </div>
              )}
            </div>
            <p className="mt-4 font-semibold">{listing.location.city}, {listing.location.state}, {listing.location.country}</p>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="relative">
          <div className="sticky top-28 bg-white border shadow-xl rounded-2xl p-6">
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold">${listing.pricePerNight}</span>
              <span className="text-gray-600">night</span>
            </div>

            <div className="border rounded-xl mb-4 overflow-hidden">
              <div className="flex border-b">
                <div className="p-3 w-1/2 border-r cursor-pointer hover:bg-gray-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Check-in</div>
                  <DatePicker 
                    selected={startDate} 
                    onChange={(date) => setStartDate(date)} 
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    excludeDateIntervals={unavailableDates}
                    className="w-full outline-none bg-transparent cursor-pointer text-sm font-semibold text-gray-700"
                  />
                </div>
                <div className="p-3 w-1/2 cursor-pointer hover:bg-gray-50">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Checkout</div>
                  <DatePicker 
                    selected={endDate} 
                    onChange={(date) => setEndDate(date)} 
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    excludeDateIntervals={unavailableDates}
                    className="w-full outline-none bg-transparent cursor-pointer text-sm font-semibold text-gray-700"
                  />
                </div>
              </div>
              <div className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Guests</div>
                <select 
                  className="w-full outline-none bg-transparent cursor-pointer text-sm font-semibold text-gray-700"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {[...Array(listing.maxGuests).keys()].map(i => (
                    <option key={i+1} value={i+1}>{i+1} guest{i+1 > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors mb-4"
            >
              {bookingLoading ? 'Reserving...' : 'Reserve'}
            </button>
            <p className="text-center text-sm text-gray-500 mb-6">You won't be charged yet</p>

            <div className="flex justify-between mb-3 text-gray-600">
              <span className="underline">${listing.pricePerNight} x {nights} nights</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600 border-b pb-4">
              <span className="underline">HomeSphere service fee</span>
              <span>${Math.round(totalPrice * 0.1)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total before taxes</span>
              <span>${totalPrice + Math.round(totalPrice * 0.1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
