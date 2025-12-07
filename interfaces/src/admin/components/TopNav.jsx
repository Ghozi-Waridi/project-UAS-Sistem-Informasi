import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// Define navigation links for Admin
const adminNavLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/decision-maker', label: 'Decision Maker' },
  { to: '/kandidat', label: 'Kandidat' },
  { to: '/hasil', label: 'Hasil' },
];

// Define navigation links for Decision Maker
const dmNavLinks = [
  { to: '/dm/dashboard', label: 'Dashboard' },
  // { to: '/dm/kandidat', label: 'Kandidat' }, // Feature not ready
  // { to: '/dm/evaluasi-semua', label: 'Evaluasi' }, // Feature not ready
  { to: '/dm/hasil', label: 'Hasil' },
  // { to: '/dm/konsensus-detail', label: 'Konsensus' }, // Feature not ready
];

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Handle scroll effect for Landing Page
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const isLanding = location.pathname === '/';

  // Determine which nav links to show based on user role
  let appNavLinks = [];
  if (user?.role === 'dm') {
    appNavLinks = dmNavLinks;
  } else if (user?.role === 'admin') {
    appNavLinks = adminNavLinks;
  }

  // --- RENDER HELPERS ---

  const Logo = () => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => isLanding ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
        <div className="absolute inset-0 bg-white rounded-xl border border-slate-200"></div>
        <span className="relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">G</span>
      </div>
      <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-cyan-600 transition-colors">GDSS <span className="text-cyan-600">Pro</span></span>
    </div>
  );

  // --- LANDING PAGE NAVBAR ---
  if (isLanding) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Logo />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {['Fitur', 'Keunggulan', 'Testimoni'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative hover:text-cyan-600 transition-colors py-2 group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <button
              onClick={() => navigate("/login")}
              className="text-slate-600 hover:text-cyan-600 transition font-medium"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
            >
              Daftar Gratis
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // --- DASHBOARD / APP NAVBAR ---
  return (
    <header className="fixed top-4 left-0 right-0 z-40">
      <div className="max-w-5xl mx-auto flex justify-center">
        <div className="flex items-center gap-8 bg-white/90 backdrop-blur-xl rounded-full shadow-xl px-8 py-3 border border-gray-100">

          {/* Logo (Simplified for App) */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 pr-4 border-r border-gray-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              G
            </div>
            <span className="font-semibold text-slate-800">GDSS <span className="text-cyan-600">Pro</span></span>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-2 text-sm">
            {appNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full transition-all duration-300 ${isActive
                    ? 'text-cyan-600 font-bold bg-cyan-50 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User actions */}
          <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name || 'User'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-full bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 rounded-full bg-cyan-600 text-white text-sm font-semibold shadow-md hover:bg-cyan-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

