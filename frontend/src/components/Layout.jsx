import { Link, Outlet, useNavigate } from 'react-router-dom';
import { PlusCircle, Map, Home, LogIn, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('civic_user_name');

  const handleLogout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user_id');
    localStorage.removeItem('civic_user_name');
    navigate('/login');
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 font-sans text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      {/* Top Navigation */}
      <nav className="bg-primary-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-heading font-bold tracking-tight flex items-center gap-2">
            <Map className="w-6 h-6 text-primary-100" />
            <span>CivicTracker</span>
          </Link>

          <div className="flex items-center gap-4">
             <ThemeToggle />
             <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary-100 font-medium transition">Home</Link>
            <Link to="/profile" className="hover:text-primary-100 font-medium transition">Profile</Link>
            <Link to="/admin" className="hover:text-primary-100 font-medium transition">Admin</Link>
            
            {userName ? (
              <div className="flex items-center gap-4">
                 <span className="text-sm opacity-90">Hi, {userName}</span>
                 <button onClick={handleLogout} className="text-sm font-semibold hover:text-red-200 flex items-center gap-1">
                   <LogOut className="w-4 h-4" /> Logout
                 </button>
              </div>
            ) : (
               <Link to="/login" className="flex items-center gap-1 hover:text-primary-200 font-medium">
                 <LogIn className="w-4 h-4" /> Login
               </Link>
            )}

            <Link to="/report" className="bg-white text-primary-700 px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-neutral-100 transition flex items-center gap-2 text-sm">
              <PlusCircle className="w-4 h-4" />
              Report
            </Link>
             </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around py-3 z-50 pb-safe">
        <Link to="/" className="flex flex-col items-center text-xs text-neutral-500 hover:text-primary-700">
          <Home className="w-6 h-6 mb-1" />
          Home
        </Link>
        <Link to="/report" className="flex flex-col items-center text-xs text-primary-700 font-bold">
          <div className="bg-primary-100 p-2 rounded-full -mt-6 border-4 border-white shadow-md">
            <PlusCircle className="w-8 h-8 text-primary-700" />
          </div>
          Report
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-xs text-neutral-500 hover:text-primary-700">
          <div className="w-6 h-6 rounded-full bg-neutral-200 mb-1 flex items-center justify-center">
             <span className="text-xs font-bold text-neutral-500">U</span>
          </div>
          Profile
        </Link>
        <Link to="/admin" className="flex flex-col items-center text-xs text-neutral-500 hover:text-neutral-900">
          <div className="w-6 h-6 rounded-full bg-neutral-900 mb-1 flex items-center justify-center">
             <span className="text-xs font-bold text-white">A</span>
          </div>
          Admin
        </Link>
      </div>
    </div>
  );
}
