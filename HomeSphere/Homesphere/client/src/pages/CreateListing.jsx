import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { MapPin, DollarSign, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const { currency } = useCurrency();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    category: 'Apartment',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        setError("File too large (max 2MB)");
        return;
      }
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
    console.log('--- STARTING PUBLISH FLOW ---');
    setError(null);
    
    // Safety check for user session
    if (!user || !user.token) {
      const msg = "You must be logged in as a host to publish.";
      setError(msg);
      alert(msg);
      window.scrollTo(0, 0);
      return;
    }

    // Explicit Validation
    if (!formData.title || !formData.description || !formData.address || !formData.price) {
      const msg = "Please fill in all required fields (Title, Description, Address, and Price).";
      setError(msg);
      alert(msg);
      window.scrollTo(0, 0);
      return;
    }

    if (formData.images.length === 0) {
      const msg = "Please upload at least one property image.";
      setError(msg);
      alert(msg);
      window.scrollTo(0, 0);
      return;
    }
    
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      
      const payload = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.category || 'Apartment',
        pricePerNight: Number(formData.price),
        images: formData.images,
        maxGuests: 2,
        amenities: ['Wifi', 'Kitchen'],
        location: {
          address: formData.address,
          city: formData.address.split(',')[1]?.trim() || 'City',
          state: 'State',
          country: formData.address.split(',')[2]?.trim() || 'Country'
        }
      };

      console.log('Payload constructed:', payload);
      const response = await axios.post('/api/listings', payload, config);
      
      console.log('Publish result:', response);
      alert('Listing Published Successfully!');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Submission failed:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Check all fields and try again.';
      setError(errorMessage);
      alert(errorMessage);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Create new listing</h1>
        <p className="text-gray-400 font-medium text-lg mt-2 tracking-tight">Set up your space and join the HomeSphere host community.</p>
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
                name="title"
                value={formData.title} onChange={handleChange}
                placeholder="e.g. Modern Penthouse with City View" 
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Category</label>
              <select 
                name="category"
                value={formData.category} onChange={handleChange}
                className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-bold appearance-none cursor-pointer"
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
              name="description"
              value={formData.description} onChange={handleChange}
              placeholder="Tell guests what makes your place special..." 
              className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-medium h-32"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Address (Street, City, Country)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-300" />
                <input 
                  name="address"
                  value={formData.address} onChange={handleChange}
                  placeholder="Street, City, Country" 
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
                  name="price" type="number"
                  min="1"
                  value={formData.price} onChange={handleChange}
                  placeholder="0.00" 
                  className="w-full pl-12 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white transition-all outline-none font-extrabold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1">Property Images</label>
            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl p-6">
              <input 
                type="file" multiple accept="image/*" 
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-primary file:text-white hover:file:bg-red-500 cursor-pointer transition-all"
              />
              <p className="mt-3 text-xs text-gray-400 font-medium ml-1">Select up to 5 photos. Max 2MB per file.</p>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group h-24 rounded-xl overflow-hidden shadow-sm">
                    <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-10">
          <button 
            type="button" 
            disabled={loading}
            onClick={handleSubmit} 
            className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-xl hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
