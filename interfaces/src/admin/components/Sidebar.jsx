import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaUserTie, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBolt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Define navigation links for Admin
const adminNavLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { to: '/decision-maker', label: 'Decision Maker', icon: <FaUserTie /> },
  { to: '/kandidat', label: 'Kandidat', icon: <FaUsers /> },
  { to: '/hasil', label: 'Hasil', icon: <FaChartBar /> },
];

// Define navigation links for Decision Maker
const dmNavLinks = [
  { to: '/dm/dashboard', label: 'Dashboard', icon: <FaHome /> },
  { to: '/dm/hasil', label: 'Hasil', icon: <FaChartBar /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSpacesMenu, setShowSpacesMenu] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // Determine which nav links to show based on user role
  let appNavLinks = [];
  if (user?.role === 'dm') {
    appNavLinks = dmNavLinks;
  } else if (user?.role === 'admin') {
    appNavLinks = adminNavLinks;
  }

  return (
    <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'} flex flex-col shadow-lg z-50`}>
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.company_name || user?.email || 'Acme Co.'}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? (
              <FaChevronDown className="text-gray-600" />
            ) : (
              <FaChevronUp className="text-gray-600" />
            )}
          </button>
        </div>
        
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md mx-auto mt-2">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white">
        {!isCollapsed ? (
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            <FaBolt className="text-lg" />
            <span className="font-semibold text-sm">Quick Actions</span>
          </button>
        ) : (
          <button className="w-full flex items-center justify-center px-3 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md">
            <FaBolt className="text-lg" />
          </button>
        )}
      </div>

      {/* Settings */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <button
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors`}
        >
          <FaCog className="text-base" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
      </div>

      {/* Studio / Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 bg-white">
        {!isCollapsed && (
          <div className="px-4 mb-2">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <FaBolt className="text-gray-700" />
              <span className="font-semibold text-sm text-gray-900">Studio</span>
            </div>
          </div>
        )}

        {/* Spaces Section */}
        <div className="px-4 mt-4">
          <button
            onClick={() => setShowSpacesMenu(!showSpacesMenu)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mb-2`}
          >
            {!isCollapsed && <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Spaces</span>}
            {isCollapsed ? (
              <FaHome className="text-base" />
            ) : (
              <span className="text-lg">{showSpacesMenu ? '−' : '+'}</span>
            )}
          </button>

          {/* Navigation Links */}
          {(showSpacesMenu || isCollapsed) && (
            <nav className="space-y-1">
              {appNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="text-lg">{link.icon}</span>
                  {!isCollapsed && <span className="text-sm font-medium">{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium`}
        >
          <FaSignOutAlt className="text-base" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}
