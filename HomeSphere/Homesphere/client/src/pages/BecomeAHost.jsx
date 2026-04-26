import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const BecomeAHost = () => {
  const { user } = useContext(AuthContext);
  const { currency } = useCurrency();
  const baseEarnings = 100;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter">
          Host your home. <br /> 
          <span className="text-primary italic">Earn {currency.symbol}{(baseEarnings * currency.rate).toFixed(0)}.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-bold tracking-tight">
          Estimated nightly earnings in your area
        </p>
      </div>
      
      <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg font-medium leading-relaxed">
        Join our growing community of hosts on HomeSphere and turn your extra space into extra income.
      </p>

      <Link 
        to={user ? "/listings/new" : "/register?role=host"} 
        className="bg-primary text-white px-12 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:bg-red-500 transition-all transform active:scale-95"
      >
        {user ? "Start publishing now" : "Get started"}
      </Link>
    </div>
  );
};

export default BecomeAHost;
