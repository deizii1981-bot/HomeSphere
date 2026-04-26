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
      setSearchParams({}, { replace: true });
    } else {
      fetchListings();
    }
  }, [searchParams]);

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
    const newValue = propertyType === categoryValue ? '' : categoryValue;
    setPropertyType(newValue);
    fetchListings(newValue);
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading awesome places...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Filter */}
        <div className="flex gap-8 overflow-x-auto pb-4 mb-2">
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
                className={`flex flex-col items-center gap-2 cursor-pointer ${
                  isActive ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <cat.icon className="h-6 w-6" />
                <span className="text-xs font-bold">{cat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location" />
          <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min Price" />
          <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max Price" />
          <input value={guests} onChange={e => setGuests(e.target.value)} placeholder="Guests" />
          <button type="submit">Search</button>
        </form>

        {/* Listings */}
        <div className="grid grid-cols-2 gap-4">
          {listings.map((listing) => (
            <Link to={`/listings/${listing._id}`} key={listing._id}>
              <img src={listing.images[0]} alt="" />
              <h3>{listing.location.city}</h3>
              <p>{currency.symbol}{listing.pricePerNight}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;