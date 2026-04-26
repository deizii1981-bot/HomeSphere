import { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Home, Star, DollarSign, Plus, UserCircle, 
  Clock, History, XCircle, ChevronRight, Settings
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [myListings, setMyListings] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Independent Booking Fetch
      try {
        const bookingRes = user.role === 'guest' 
          ? await axios.get('/api/bookings/my', config)
          : await axios.get('/api/bookings/host', config);
        setBookings(bookingRes.data || []);
        console.log('Bookings fetched:', bookingRes.data);
      } catch (err) {
        console.error('Booking fetch failed:', err);
        setBookings([]);
      }

      // Independent Listing Fetch for Hosts
      if (user.role === 'host') {
        try {
          const listingsRes = await axios.get('/api/listings/my', config);
          setMyListings(listingsRes.data || []);
          console.log('My listings fetched:', listingsRes.data);
        } catch (err) {
          console.error('Listing fetch failed:', err);
          setMyListings([]);
        }
      }
      
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/listings/${id}`, config);
      setMyListings(prev => prev.filter(l => l._id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete listing.');
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-primary font-bold text-xl tracking-tighter">HOMESPHERE</div>
    </div>
  );

  const filtered = bookings.filter(b => {
    const isPast = new Date(b.checkIn) < new Date();
    if (activeTab === 'upcoming') return !isPast && b.status !== 'cancelled';
    if (activeTab === 'past') return isPast && b.status !== 'cancelled';
    return b.status === 'cancelled';
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
            Welcome, <span className="text-primary capitalize">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-400 font-medium text-lg mt-2">Manage your listings, bookings, and profile.</p>
        </div>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 border-2 border-gray-100 px-6 py-3 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all shadow-sm"
        >
          <Settings className="h-5 w-5" />
          {isProfileOpen ? 'Hide Settings' : 'Edit Profile'}
        </button>
      </div>

      {/* Modern Profile Section */}
      {isProfileOpen && (
        <div className="bg-white p-10 rounded-[32px] border-2 border-primary/5 shadow-xl shadow-primary/5 space-y-8 animate-in slide-in-from-top-6 duration-500">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <UserCircle className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Profile Details</h3>
              <p className="text-gray-400 font-medium">Update how guests see you on the platform.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Phone</label>
              <input type="text" placeholder="+1 (555) 000-0000" className="p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all w-full font-bold outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Location</label>
              <input type="text" placeholder="London, UK" className="p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all w-full font-bold outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Bio</label>
              <textarea placeholder="Describe yourself to your guests..." className="p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white transition-all w-full font-medium h-32 outline-none" />
            </div>
          </div>
          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none">
            Save Changes
          </button>
        </div>
      )}

      {/* Clean Stats Row (Host) */}
      {user.role === 'host' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Earnings', val: `${currency.symbol}0`, path: '/dashboard/earnings', icon: DollarSign, bg: 'bg-green-50', text: 'text-green-600' },
            { label: 'Nights Hosted', val: '0', path: '/dashboard/stats', icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600' },
            { label: 'Average Rating', val: '—', path: '/dashboard/reviews', icon: Star, bg: 'bg-yellow-50', text: 'text-yellow-600' },
          ].map(s => (
            <Link key={s.label} to={s.path} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className={`${s.bg} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <s.icon className={`h-6 w-6 ${s.text}`} />
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tighter">{s.val}</p>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">{s.label}</p>
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 group-hover:text-primary transition-colors">Details</span>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Polished Bookings Section */}
      <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
        <div className="p-10 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your {user.role === 'guest' ? 'Trips' : 'Bookings'}</h2>
          <div className="flex bg-gray-100/80 p-1.5 rounded-[20px] backdrop-blur-sm">
            {['upcoming', 'past', 'cancelled'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-2.5 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === t ? 'bg-white text-primary shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-2">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
               <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="h-10 w-10 text-gray-200" />
               </div>
               <h3 className="text-xl font-bold text-gray-900">Nothing to show yet</h3>
               <p className="text-gray-400 font-medium">Activity for this category will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2 p-6">
              {filtered.map(b => (
                <div key={b._id} className="p-6 rounded-[28px] hover:bg-gray-50 transition flex flex-col sm:flex-row items-center justify-between gap-6 group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-28 rounded-[20px] bg-gray-100 overflow-hidden shrink-0 shadow-sm transition-transform group-hover:scale-105">
                      <img src={b.listing?.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-primary transition-colors">{b.listing?.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-gray-500">{new Date(b.checkIn).toLocaleDateString()}</span>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm font-black text-gray-900 underline decoration-primary decoration-2 underline-offset-4">
                          {currency.symbol}{(b.totalPrice * currency.rate).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 
                      ${b.status === 'confirmed' ? 'border-primary/10 text-primary bg-primary/5' : 'border-gray-100 text-gray-400'}`}>
                      {b.status}
                    </span>
                    <button className="p-2 border border-gray-100 rounded-full hover:bg-white hover:shadow-md transition">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refined Listings Section */}
      {user.role === 'host' && (
        <div className="bg-white border border-gray-100 rounded-[40px] p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight italic">Host Portfolio</h2>
              <p className="text-gray-400 font-medium">Manage and optimize your active listings.</p>
            </div>
            <Link to="/listings/new" className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-md font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200">
              <Plus className="h-5 w-5 bg-primary rounded-full p-0.5" /> Start New Listing
            </Link>
          </div>
          
          {myListings.length === 0 ? (
            <div className="text-center py-20 border-4 border-dashed border-gray-50 rounded-[40px] group cursor-pointer hover:border-primary/10 transition-all">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Home className="h-8 w-8 text-gray-200 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-gray-400 font-bold text-lg">No listings active yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {myListings.map(listing => (
                 <div key={listing._id} className="group flex flex-col gap-3">
                   <div className="aspect-[4/3] rounded-3xl overflow-hidden relative shadow-sm border border-gray-100">
                     <img src={listing.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                       {listing.propertyType}
                     </div>
                   </div>
                   <div className="px-2">
                     <div className="flex justify-between items-center">
                       <h3 className="font-extrabold text-lg text-gray-900 truncate">{listing.title}</h3>
                       <span className="text-primary font-black text-sm">{currency.symbol}{(listing.pricePerNight * currency.rate).toFixed(0)}</span>
                     </div>
                     <p className="text-gray-400 text-xs font-medium truncate">{listing.location.address}</p>
                     
                     <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                       <button 
                         onClick={() => navigate(`/listings/edit/${listing._id}`)}
                         className="flex-1 bg-gray-50 text-gray-900 py-3 rounded-xl font-bold text-xs hover:bg-gray-100 transition"
                       >
                         Edit
                       </button>
                       <button 
                         onClick={() => handleDeleteListing(listing._id)}
                         className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-100 transition"
                       >
                         Delete
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
