import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import BecomeAHost from './pages/BecomeAHost';
import Earnings from './pages/Earnings';
import Stats from './pages/Stats';
import Reviews from './pages/Reviews';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20 bg-gray-50/50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/become-a-host" element={<BecomeAHost />} />
            <Route path="/listings/:id" element={<ListingDetails />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/earnings" 
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <Earnings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/stats" 
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <Stats />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/reviews" 
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <Reviews />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listings/new" 
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <CreateListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listings/edit/:id" 
              element={
                <ProtectedRoute allowedRoles={['host']}>
                  <EditListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
