import { useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [data, setData] = useState({ users: [], listings: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [usersRes, listingsRes, bookingsRes] = await Promise.all([
          axios.get('/api/admin/users', config),
          axios.get('/api/admin/listings', config),
          axios.get('/api/admin/bookings', config)
        ]);

        setData({
          users: usersRes.data,
          listings: listingsRes.data,
          bookings: bookingsRes.data
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/users/${userId}`, { role: newRole }, config);
      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u._id === userId ? { ...u, role: newRole } : u)
      }));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/bookings/${bookingId}`, { status: 'cancelled' }, config);
      setData(prev => ({
        ...prev,
        bookings: prev.bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b)
      }));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if(!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/listings/${listingId}`, config);
      setData(prev => ({
        ...prev,
        listings: prev.listings.filter(l => l._id !== listingId)
      }));
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="flex gap-4 border-b mb-6">
        {['users', 'listings', 'bookings'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 capitalize font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 overflow-x-auto">
        {activeTab === 'users' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'host' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <select 
                      value={u.role} 
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm outline-none"
                    >
                      <option value="guest">Guest</option>
                      <option value="host">Host</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'listings' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Title</th>
                <th className="p-3">Host</th>
                <th className="p-3">Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.listings.map(l => (
                <tr key={l._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium max-w-xs truncate">{l.title}</td>
                  <td className="p-3 text-gray-600">{l.host?.name || 'Unknown'}</td>
                  <td className="p-3">${l.pricePerNight}</td>
                  <td className="p-3">
                    <button onClick={() => handleDeleteListing(l._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'bookings' && (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Listing</th>
                <th className="p-3">Guest</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map(b => (
                <tr key={b._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-medium max-w-xs truncate">{b.listing?.title || 'Unknown'}</td>
                  <td className="p-3 text-gray-600">{b.guest?.name || 'Unknown'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-green-100 text-green-800' : b.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {b.status !== 'cancelled' && (
                      <button onClick={() => handleCancelBooking(b._id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Force Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
