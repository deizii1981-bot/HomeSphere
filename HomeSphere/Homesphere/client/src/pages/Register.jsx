import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'host') {
      setRole('host');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);
    const errs = {};
    if (!name) errs.name = 'Name is required';
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    try {
      const userData = await register(name, email, password, role);
      if (userData.role === 'host') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-lg border border-gray-100 transition-all hover:shadow-primary/5">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-900 tracking-tight">Create profile</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Join HomeSphere to start hosting or stays</p>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-shake">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-gray-800 placeholder:text-gray-400
                ${validationErrors.name 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-100 bg-gray-50/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {validationErrors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-2">{validationErrors.name}</p>}
          </div>
          <div className="group">
            <input
              type="email"
              placeholder="Email address"
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-gray-800 placeholder:text-gray-400
                ${validationErrors.email 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-100 bg-gray-50/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErrors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-2">{validationErrors.email}</p>}
          </div>
          <div className="group">
            <input
              type="password"
              placeholder="Create Password"
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-gray-800 placeholder:text-gray-400
                ${validationErrors.password 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-100 bg-gray-50/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-2">{validationErrors.password}</p>}
          </div>
          
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-tight">I want to be a:</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="guest" 
                  checked={role === 'guest'} 
                  onChange={() => setRole('guest')}
                  className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <span className={`text-sm font-bold transition-colors ${role === 'guest' ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>Guest</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="host" 
                  checked={role === 'host'} 
                  onChange={() => setRole('host')}
                  className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                />
                <span className={`text-sm font-bold transition-colors ${role === 'host' ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>Host</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4"
          >
            Agree and continue
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
