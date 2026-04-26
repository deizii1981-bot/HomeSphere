import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setError(null);
    const errs = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    try {
      const userData = await login(email, password);
      if (userData.role === 'host') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-lg border border-gray-100 transition-all hover:shadow-primary/5">
        <h2 className="text-3xl font-extrabold text-center mb-2 text-gray-900 tracking-tight">Welcome back</h2>
        <p className="text-center text-gray-500 mb-8 font-medium">Log in to manage your HomeSphere stays</p>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 animate-shake">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Password"
              className={`w-full px-5 py-4 rounded-xl border-2 transition-all outline-none text-gray-800 placeholder:text-gray-400
                ${validationErrors.password 
                  ? 'border-red-400 bg-red-50/30' 
                  : 'border-gray-100 bg-gray-50/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validationErrors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-2">{validationErrors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-4"
          >
            Continue
          </button>
        </form>

        <div className="mt-10 flex items-center gap-4 text-gray-400">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold uppercase tracking-widest">or</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="mt-8 text-center text-sm font-medium text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
