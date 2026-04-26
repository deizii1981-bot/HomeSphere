import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { useSearchParams, Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { Star, Palmtree, Building2, Castle, Mountain, Trees, Search } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency } = useCurrency();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const fetchListings = async (overrideType) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (guests) params.append('guests', guests);
      
      const typeToSearch = overrideType !== undefined ? overrideType : propertyType;
      if (typeToSearch) params.append('propertyType', typeToSearch);

      const { data } = await axios.get(`/api/listings?${params.toString()}`);
      setListings(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setLocation('');
      setMinPrice('');
      setMaxPrice('');
      setGuests('');
      setPropertyType('');
      // Clear the reset param from URL without refreshing
      setSearchParams({}, { replace: true });
    } else {
      fetchListings();
    }
  }, [searchParams]);

  // Initial fetch if no search params and not resetting
  useEffect(() => {
    if (!searchParams.get('reset')) {
      fetchListings();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleCategoryClick = (categoryValue) => {
    // Toggle off if clicking the same category again
    const newValue = propertyType === categoryValue ? '' : categoryValue;
    setPropertyType(newValue);
    fetchListings(newValue); // pass directly as state won't be updated yet
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading awesome places...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter Bar */}
        <div className="flex gap-8 overflow-x-auto pb-4 mb-2 hide-scrollbar bg-transparent">
          {[
            { label: 'Beach House', value: 'House', icon: Palmtree },
            { label: 'City Apartment', value: 'Apartment', icon: Building2 },
            { label: 'Villa', value: 'Villa', icon: Castle },
            { label: 'Cabin', value: 'Cabin', icon: Mountain },
            { label: 'Countryside', value: 'Other', icon: Trees },
          ].map(cat => {
            const isActive = propertyType === cat.value;
            return (
              <div 
                key={cat.label} 
                onClick={() => handleCategoryClick(cat.value)}
                className={`flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 shrink-0 pb-3 border-b-[3px] 
                  ${isActive 
                    ? 'text-primary border-primary opacity-100 scale-105' 
                    : 'text-gray-500 border-transparent opacity-60 hover:opacity-100 hover:text-black hover:border-gray-200'
                  }`}
              >
                <cat.icon className={`h-6 w-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                <span className={`text-xs font-bold ${isActive ? 'text-black' : ''}`}>
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-gray-200 mb-8"></div>

        {/* Advanced Search Form */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="p-2 bg-white shadow-lg hover:shadow-xl transition-shadow rounded-full border border-gray-200 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex-1 flex items-center px-6">
              <input 
                type="text" 
                placeholder="Where to?" 
                className="outline-none w-full p-2 bg-transparent text-sm font-semibold text-gray-800 placeholder:text-gray-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
            
            <div className="flex-1 flex flex-col px-4">
              <span className="text-[10px] font-bold uppercase text-gray-500 ml-2">Min Price</span>
              <input 
                type="number" 
                min="0"
                placeholder={`${currency.symbol}0`} 
                className="outline-none w-full p-1 bg-transparent text-sm font-semibold"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="flex-1 flex flex-col px-4">
              <span className="text-[10px] font-bold uppercase text-gray-500 ml-2">Max Price</span>
              <input 
                type="number" 
                min="0"
                placeholder={`${currency.symbol}500+`} 
                className="outline-none w-full p-1 bg-transparent text-sm font-semibold"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

            <div className="flex-1 flex flex-col px-4">
              <span className="text-[10px] font-bold uppercase text-gray-500 ml-2">Guests</span>
              <input 
                type="number" 
                min="1"
                placeholder="Add guests" 
                className="outline-none w-full p-1 bg-transparent text-sm font-semibold"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </div>

            <button type="submit" className="bg-primary hover:bg-red-500 text-white rounded-full p-4 shrink-0 transition-colors flex items-center justify-center gap-2 px-6">
              <Search className="h-4 w-4 stroke-[3px]" />
              <span className="font-bold text-sm">Search</span>
            </button>
          </form>
        </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <Link to={`/listings/${listing._id}`} key={listing._id} className="group cursor-pointer flex flex-col gap-2">
            <div className="aspect-square w-full rounded-xl overflow-hidden relative">
              <img 
                src={listing.images[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
                alt={listing.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="flex justify-between items-start mt-2">
              <h3 className="font-semibold text-text-dark truncate mr-2">{listing.location.city}, {listing.location.country}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-current text-text-dark" />
                <span className="text-sm">{listing.avgRating > 0 ? listing.avgRating.toFixed(1) : 'New'}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm truncate">{listing.title}</p>
            <p className="font-semibold text-text-dark mt-1">
              {currency.symbol}{(listing.pricePerNight * currency.rate).toFixed(0)} <span className="font-normal">night</span>
            </p>
          </Link>
        ))}
      </div>
      
      {listings.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No exact matches</h2>
          <p>Try changing or removing some of your filters or exploring another destination.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
