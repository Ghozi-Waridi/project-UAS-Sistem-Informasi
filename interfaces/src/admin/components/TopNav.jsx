import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/beranda', label: 'Beranda' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/decision-maker', label: 'Decision Maker' },
  { to: '/kandidat', label: 'Kandidat' },
  { to: '/hasil', label: 'Hasil' },
];

export default function TopNav() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-0 right-0 z-40">
      <div className="max-w-5xl mx-auto flex justify-center">
        <div className="flex items-center gap-8 bg-white/90 backdrop-blur-xl rounded-pill shadow-card px-8 py-3 border border-gray-100">
          
          {/* Logo + title */}
          <button
            onClick={() => navigate('/beranda')}
            className="flex items-center gap-2 pr-4 border-r border-gray-200"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm shadow-md">
              🌐
            </div>
            <span className="font-semibold text-gray-800">GDSS Pro</span>
          </button>

          {/* Nav links */}
          <nav className="flex items-center gap-4 text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2 py-1 rounded-full transition ${
                    isActive
                      ? 'text-blue-600 font-semibold bg-blue-50'
                      : 'text-gray-500 hover:text-gray-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Login button — sudah diarahkan ke /login */}
          <button
            onClick={() => navigate('/login')}
            className="ml-4 px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
