import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { Search, UserCircle, Menu, Globe, Plus, Minus, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { currency, changeCurrency } = useCurrency();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSearchMenu, setActiveSearchMenu] = useState(null); // 'dates', 'guests'

  // Date State
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Guest State
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, infants: 0 });

  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setActiveSearchMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const updateGuest = (type, action) => {
    setGuestCounts(prev => {
      const val = prev[type];
      if (action === 'inc') return { ...prev, [type]: val + 1 };
      if (action === 'dec' && val > 0) {
        if (type === 'adults' && val === 1) return prev; // Min 1 adult
        return { ...prev, [type]: val - 1 };
      }
      return prev;
    });
  };

  const totalGuests = guestCounts.adults + guestCounts.children;
  const guestLabel = totalGuests > 0
    ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${guestCounts.infants > 0 ? `, ${guestCounts.infants} infant${guestCounts.infants > 1 ? 's' : ''}` : ''}`
    : 'Add guests';

  const dateLabel = startDate && endDate
    ? `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : 'Any week';

  // Simple Date Logic for Calendar
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const renderCalendar = (monthOffset) => {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    const month = targetMonth.getMonth();
    const year = targetMonth.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} />);
    for (let d = 1; d <= daysInMonth; d++) {
      const current = new Date(year, month, d);
      const isSelected = (startDate && current.getTime() === startDate.getTime()) || (endDate && current.getTime() === endDate.getTime());
      const isInRange = startDate && endDate && current > startDate && current < endDate;

      days.push(
        <div
          key={d}
          onClick={() => handleDateClick(current)}
          className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer text-sm font-semibold transition-all
            ${isSelected ? 'bg-primary text-white scale-110' : ''}
            ${isInRange ? 'bg-primary/10 text-primary rounded-none' : ''}
            ${!isSelected && !isInRange ? 'hover:bg-gray-100' : ''}
          `}
        >
          {d}
        </div>
      );
    }

    return (
      <div className="flex-1 min-w-[280px]">
        <h3 className="text-center font-bold mb-4 text-gray-800">
          {targetMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const quickSelect = (unit, count) => {
    const start = new Date();
    const end = new Date();
    if (unit === 'week') end.setDate(start.getDate() + (7 * count));
    if (unit === 'month') end.setMonth(start.getMonth() + count);
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <nav className="fixed w-full bg-white z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary" onClick={() => setActiveSearchMenu(null)}>
            <Globe className="h-7 w-7 text-primary" />
            <span className="text-2xl font-extrabold tracking-tight text-primary">
              HomeSphere
            </span>
          </Link>

          {/* Search Bar Container */}
          <div className="relative" ref={searchRef}>
            <div className={`hidden md:flex items-center border border-gray-200 rounded-full py-1 shadow-sm hover:shadow-md transition-all bg-white relative
              ${activeSearchMenu ? 'bg-gray-100 ring-1 ring-gray-200' : ''}`}>

              <Link to="/?reset=true"
                className={`text-sm font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer
                  ${activeSearchMenu ? 'hover:bg-white' : ''}`}
                onClick={() => setActiveSearchMenu(null)}
              >
                Anywhere
              </Link>

              <div className="w-px h-6 bg-gray-200"></div>

              <button
                onClick={() => setActiveSearchMenu(activeSearchMenu === 'dates' ? null : 'dates')}
                className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap
                  ${activeSearchMenu === 'dates' ? 'bg-white shadow-md scale-105' : 'hover:bg-gray-100'}`}
              >
                {dateLabel}
              </button>

              <div className="w-px h-6 bg-gray-200"></div>

              <button
                onClick={() => setActiveSearchMenu(activeSearchMenu === 'guests' ? null : 'guests')}
                className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all cursor-pointer whitespace-nowrap
                  ${activeSearchMenu === 'guests' ? 'bg-white shadow-md scale-105 text-black' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {guestLabel}
              </button>

              <div className="bg-primary p-2.5 rounded-full text-white mx-1.5 cursor-pointer hover:bg-red-500 transition-all shadow-sm">
                <Search className="h-4 w-4 stroke-[3px]" />
              </div>
            </div>

            {/* Date Dropdown */}
            {activeSearchMenu === 'dates' && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 p-8 bg-white rounded-[32px] shadow-2xl border border-gray-100 z-[100] w-[700px] animate-in fade-in zoom-in duration-200">
                <div className="flex gap-12 mb-8">
                  {renderCalendar(0)}
                  {renderCalendar(1)}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex gap-3">
                    <button onClick={() => quickSelect('week', 1)} className="px-4 py-2 border rounded-full text-xs font-bold hover:border-black transition">1 week</button>
                    <button onClick={() => quickSelect('week', 2)} className="px-4 py-2 border rounded-full text-xs font-bold hover:border-black transition">2 weeks</button>
                    <button onClick={() => quickSelect('month', 1)} className="px-4 py-2 border rounded-full text-xs font-bold hover:border-black transition">1 month</button>
                  </div>
                  <button
                    onClick={() => { setStartDate(null); setEndDate(null); }}
                    className="text-sm font-bold underline hover:text-gray-600"
                  >
                    Clear dates
                  </button>
                </div>
              </div>
            )}

            {/* Guest Dropdown */}
            {activeSearchMenu === 'guests' && (
              <div className="absolute right-0 mt-3 p-8 bg-white rounded-[32px] shadow-2xl border border-gray-100 z-[100] w-[400px] animate-in fade-in zoom-in duration-200">
                <div className="space-y-6">
                  {[
                    { key: 'adults', label: 'Adults', sub: 'Ages 13 or above' },
                    { key: 'children', label: 'Children', sub: 'Ages 2–12' },
                    { key: 'infants', label: 'Infants', sub: 'Under 2' },
                  ].map(row => (
                    <div key={row.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-gray-800">{row.label}</p>
                        <p className="text-gray-400 text-xs">{row.sub}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateGuest(row.key, 'dec')}
                          className={`h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center transition
                            ${(row.key === 'adults' ? guestCounts[row.key] <= 1 : guestCounts[row.key] <= 0) ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-4 text-center font-semibold">{guestCounts[row.key]}</span>
                        <button
                          onClick={() => updateGuest(row.key, 'inc')}
                          className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-black transition"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setActiveSearchMenu(null)}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-1 relative">
            {(!user || user.role === 'guest') && (
              <Link to="/become-a-host" className="hidden md:block text-sm font-semibold hover:bg-gray-100 px-4 py-3 rounded-full cursor-pointer transition text-gray-700">
                Become a Host
              </Link>
            )}

            {/* Static Currency Selector Dropdown */}
            <div className="hidden md:block">
              <select
                value={currency.code}
                onChange={(e) => changeCurrency(e.target.value)}
                className="appearance-none bg-transparent hover:bg-gray-100 px-3 py-3 rounded-full transition cursor-pointer text-sm font-bold text-gray-700 outline-none"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="INR">₹ INR</option>
              </select>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 border rounded-full p-2 hover:shadow-md transition-shadow"
            >
              <Menu className="h-5 w-5" />
              <UserCircle className="h-8 w-8 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-16 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] flex flex-col">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 text-sm">
                      <p className="font-bold capitalize">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="px-4 py-3 hover:bg-gray-100 text-sm font-semibold transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 hover:bg-gray-100 text-sm text-left w-full transition"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 hover:bg-gray-100 text-sm font-semibold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 hover:bg-gray-100 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
