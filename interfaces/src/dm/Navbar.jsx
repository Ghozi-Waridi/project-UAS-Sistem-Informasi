import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-white shadow-md py-4 px-8 sticky top-0 z-10">
            <ul className="flex space-x-8">
                <li>
                    <NavLink
                        to="/dashboard-dm"
                        className={({ isActive }) =>
                            `text-gray-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 ${isActive ? "active-nav-link" : ""
                            }`
                        }
                    >
                        Dashboard DM
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/kandidat"
                        className={({ isActive }) =>
                            `text-gray-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 ${isActive ? "active-nav-link" : ""
                            }`
                        }
                    >
                        Manajemen Kandidat
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/hasil"
                        className={({ isActive }) =>
                            `text-gray-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-200 ${isActive ? "active-nav-link" : ""
                            }`
                        }
                    >
                        Hasil Seleksi
                    </NavLink>
                </li>
                {/* Penilaian tidak ada di navbar utama karena diakses dari daftar kandidat */}
            </ul>
        </nav>
    );
}

export default Navbar;