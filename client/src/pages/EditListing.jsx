import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { MapPin, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';

const EditListing = () => {
  const { user } = useContext(AuthContext);
  const { currency } = useCurrency();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    category: 'Apartment',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`/api/listings/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          address: data.location.address,
          price: data.pricePerNight,
          category: data.propertyType,
          images: data.images
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load listing data.");
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.category,
        pricePerNight: Number(formData.price),
        images: formData.images,
        location: {
          address: formData.address,
          city: formData.address.split(',')[1]?.trim() || 'City',
          state: 'State',
          country: formData.address.split(',')[2]?.trim() || 'Country'
        }
      };

      await axios.put(`/api/listings/${id}`, payload, config);
      alert('Listing updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading listing...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Edit Listing</h1>
        <p className="text-gray-400 font-medium text-lg mt-2">Update your property details.</p>
      </div>

      <div className="space-y-8 bg-white p-10 rounded-[40px] border shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Title</label>
              <input 
                name="title" value={formData.title} onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Cabin</option>
                <option>Hotel</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange}
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium h-32"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-300" />
                <input 
                  name="address" value={formData.address} onChange={handleChange}
                  className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Price per night ({currency.code})</label>
              <div className="relative">
                <div className="absolute left-4 top-4 h-5 w-5 flex items-center justify-center font-black text-gray-400">
                  {currency.symbol}
                </div>
                <input 
                  name="price" type="number" value={formData.price} onChange={handleChange}
                  className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-extrabold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Property Images</label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl p-6">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500" />
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-5 gap-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative h-24 rounded-xl overflow-hidden border">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-10">
          <button 
            onClick={handleSubmit} disabled={saving}
            className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xl hover:bg-black transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
